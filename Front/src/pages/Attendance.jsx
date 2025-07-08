import React, { useState, useEffect } from "react";
import axiosInstance from "../apis/config";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import Pagination from "../components/Pagination";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      setCurrentPage(1);
      fetchAttendance();
    }
  }, [searchTerm, departmentId, fromDate, toDate]);

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/employee");
      setEmployees(res.data.data);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      let url = `/api/attendance?fromDate=${fromDate}&toDate=${toDate}`;
      if (searchTerm.trim()) url += `&employeeName=${encodeURIComponent(searchTerm.trim())}`;
      if (departmentId) url += `&departmentId=${departmentId}`;
      const res = await axiosInstance.get(url);
      setAttendanceToday(res.data);
    } catch (err) {
      console.error("Error fetching attendance", err);
      setAttendanceToday([]);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setIsEditing(true);
    reset({
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      employeeId: item.employeeId?._id,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/api/attendance/${id}`);
          Swal.fire("تم الحذف!", "تم حذف الحضور بنجاح", "success");
          fetchAttendance();
        } catch (err) {
          console.error("Error deleting attendance", err);
        }
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await axiosInstance.put(`/api/attendance/${editId}`, {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
        });
        Swal.fire("تم التعديل!", "تم تعديل الحضور بنجاح", "success");
      } else {
        await axiosInstance.post("/api/attendance", {
          employeeId: data.employeeId,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          date: data.date,
        });
        Swal.fire("تمت الإضافة!", "تم إضافة الحضور بنجاح", "success");
      }

      setShowModal(false);
      reset();
      setIsEditing(false);
      setEditId(null);
      fetchAttendance();
    } catch (err) {
      console.error(" خطأ", err);
      const msg = err.response?.data?.message;
      Swal.fire("خطأ", msg || "حدث خطأ أثناء حفظ الحضور", "error");
    }
  };

  const total = employees.length;
  const present = new Set(attendanceToday.map((a) => a.employeeId?._id)).size;
  const late = new Set(
  attendanceToday.filter((a) => a.lateMinutes > 0).map((a) => a.employeeId?._id)
).size;

  const absent = total - present;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = attendanceToday.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(attendanceToday.length / itemsPerPage);

  return (
    <div className="container mt-5" style={{ direction: "rtl" }}>
      <h2 className="text-center fw-bold mb-4" style={{ color: "#069ED3" }}>نظام حضور الموظفين</h2>

      <div className="row text-center mb-4">
        <StatCard icon={<FaUser />} label="إجمالي الموظفين" value={total} color="#E0F7FA" iconColor="text-info" />
        <StatCard icon={<FaCheckCircle />} label="الحاضرين" value={present} color="#E8F5E9" iconColor="text-success" />
        <StatCard icon={<FaClock />} label="المتأخرين" value={late} color="#FFF8E1" iconColor="text-warning" />
        <StatCard icon={<FaSignOutAlt />} label="الغياب" value={absent} color="#FFEBEE" iconColor="text-danger" />
      </div>

      {(!fromDate || !toDate) && (
        <p className="text-danger text-center">من فضلك اختر الفترة الزمنية لعرض الحضور</p>
      )}

      <div className="row mb-3">
        <div className="col-md-3 mb-2">
          <input type="text" className="form-control" placeholder="ابحث باسم الموظف" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">كل الأقسام</option>
            {departments.map(dep => <option key={dep._id} value={dep._id}>{dep.name}</option>)}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="col-md-3 mb-2">
          <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <button className="btn btn-primary mb-3" onClick={() => {
        setShowModal(true);
        setIsEditing(false);
        reset({ employeeId: "", checkIn: "", checkOut: "", date: dayjs().format("YYYY-MM-DD") });
      }}>
        إضافة حضور
      </button>
      <div className="row">
  {currentItems.length > 0 ? currentItems.map(item => (
    <div className="col-md-4 mb-3" key={item._id}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5>
            <FaUser className="ms-2 text-primary" />
            {item.employeeId?.name}
          </h5>

          <p>
            <strong>القسم:</strong>{" "}
            {item.employeeId?.department?.name || "غير محدد"}
          </p>

          <p>
            <FaSignInAlt className="ms-2 text-success" /> الدخول: {item.checkIn}
          </p>
          <p>
            <FaSignOutAlt className="ms-2 text-danger" /> الخروج: {item.checkOut}
          </p>

          <p>
            {item.lateMinutes > 0 ? (
              <>
                <FaClock className="ms-2 text-warning" />
                <span className="badge bg-warning">متأخر</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="ms-2 text-success" />
                <span className="badge bg-success">حاضر</span>
              </>
            )}
          </p>

          <p className="text-secondary">
            <FaCalendarAlt className="ms-2" />
            {new Date(item.date).toLocaleDateString("ar-EG")}
          </p>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-warning" onClick={() => handleEdit(item)}>تعديل</button>
            <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>حذف</button>
          </div>
        </div>
      </div>
    </div>
  )) : (
    <p className="text-center text-muted">لا يوجد حضور</p>
  )}
</div>


      {attendanceToday.length >= itemsPerPage && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ direction: "rtl" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header">
                  <button type="button" className="btn-close" onClick={() => { setShowModal(false); reset(); }}></button>
                  <h5 className="modal-title mx-auto">{isEditing ? "تعديل الحضور" : "إضافة حضور"}</h5>
                </div>
                <div className="modal-body">
                  {!isEditing && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">اسم الموظف</label>
                        <select className="form-select" {...register("employeeId", { required: true })}>
                          <option value="">اختر موظفًا</option>
                          {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                        </select>
                        {errors.employeeId && <small className="text-danger">يجب اختيار موظف</small>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">تاريخ الحضور</label>
                        <input type="date" className="form-control" defaultValue={dayjs().format("YYYY-MM-DD")} {...register("date", { required: true })} />
                        {errors.date && <small className="text-danger">يجب إدخال التاريخ</small>}
                      </div>
                    </>
                  )}
                  <div className="mb-3">
                    <label className="form-label">وقت الدخول</label>
                    <input type="time" className="form-control" {...register("checkIn", { required: true })} />
                    {errors.checkIn && <small className="text-danger">يجب إدخال وقت الدخول</small>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">وقت الخروج</label>
                    <input type="time" className="form-control" {...register("checkOut", { required: true })} />
                    {errors.checkOut && <small className="text-danger">يجب إدخال وقت الخروج</small>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">{isEditing ? "حفظ التعديلات" : "إضافة"}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); reset(); }}>إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ icon, label, value, color, iconColor }) => (
  <div className="col-md-3 mb-2">
    <div className="p-3 rounded shadow d-flex flex-column align-items-center" style={{ backgroundColor: color }}>
      <div className={`mb-2 ${iconColor}`}>{icon}</div>
      <h6 className="mb-1">{label}</h6>
      <p className="fs-5">{value}</p>
    </div>
  </div>
);

export default Attendance;
