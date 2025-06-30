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
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [searchTerm, setSearchTerm] = useState("");
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

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/employee");
      setEmployees(res.data.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      let url = `/api/attendance?date=${encodeURIComponent(date)}`;
      if (searchTerm.trim() !== "") {
        url += `&employeeName=${encodeURIComponent(searchTerm.trim())}`;
      }
      const res = await axiosInstance.get(url);
      setAttendanceToday(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceToday([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchAttendance();
  }, [date, searchTerm]);

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
          console.error("Error deleting attendance:", err);
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
          date,
        });
        Swal.fire("تمت الإضافة!", "تم إضافة الحضور بنجاح", "success");
      }
      setShowModal(false);
      fetchAttendance();
      reset();
      setIsEditing(false);
      setEditId(null);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg && msg.includes("تم تسجيل حضور")) {
        Swal.fire("خطأ", msg, "error");
      } else {
        Swal.fire("خطأ", msg || "حدث خطأ أثناء حفظ الحضور", "error");
        console.error(" خطأ أثناء حفظ الحضور:", err);
      }
    }
  };

  const total = employees.length;
  const present = attendanceToday.length;
  const late = attendanceToday.filter((a) => a.lateMinutes > 0).length;
  const absent = total - present;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = attendanceToday.slice(startIndex, endIndex);
  const totalPages = Math.ceil(attendanceToday.length / itemsPerPage);

  return (
    <div className="container mt-5" style={{ direction: "rtl" }}>
      <h2 className="text-center fw-bold mb-4" style={{ color: "#069ED3" }}>
        نظام حضور الموظفين
      </h2>

      <div className="row text-center mb-4">
        <div className="col-md-3">
          <div className="p-3 rounded shadow d-flex flex-column align-items-center" style={{ backgroundColor: "#E0F7FA" }}>
            <FaUser size={24} className="text-info mb-2" />
            <h6 className="mb-1 text-dark">إجمالي الموظفين</h6>
            <p className="fs-5 text-dark">{total}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 rounded shadow d-flex flex-column align-items-center" style={{ backgroundColor: "#E8F5E9" }}>
            <FaCheckCircle size={24} className="text-success mb-2" />
            <h6 className="mb-1 text-dark">الحاضرين</h6>
            <p className="fs-5 text-dark">{present}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 rounded shadow d-flex flex-column align-items-center" style={{ backgroundColor: "#FFF8E1" }}>
            <FaClock size={24} className="text-warning mb-2" />
            <h6 className="mb-1 text-dark">المتأخرين</h6>
            <p className="fs-5 text-dark">{late}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 rounded shadow d-flex flex-column align-items-center" style={{ backgroundColor: "#FFEBEE" }}>
            <FaSignOutAlt size={24} className="text-danger mb-2" />
            <h6 className="mb-1 text-dark">الغياب</h6>
            <p className="fs-5 text-dark">{absent}</p>
          </div>
        </div>
      </div>

      <div className="row mb-3 justify-content-between align-items-end">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="ابحث باسم الموظف"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>


      
      <button
  style={{
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
  }}
  onClick={() => {
    setShowModal(true);
    setIsEditing(false);
    reset({
      employeeId: "", 
    });
  }}
>
  إضافة حضور
</button>



      <div className="row mb-4">
        <div className="col-md-12">
          <div className="p-3 rounded shadow text-center" style={{ backgroundColor: "#E0F7FA" }}>
            <h6 className="mb-0 text-dark">
              <FaCalendarAlt className="ms-2 text-primary" /> التاريخ الحالي: {new Date(date).toLocaleDateString("ar-EG")}
            </h6>
          </div>
        </div>
      </div>

      <div className="row">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div className="col-md-4 mb-3" key={item._id}>
              <div className="card border shadow-sm">
                <div className="card-body" style={{ direction: "rtl" }}>
                  <h5 className="mb-2">
                    <FaUser className="ms-2 text-primary" />
                    {item.employeeId?.name}
                  </h5>
                  <p><FaSignInAlt className="ms-2 text-success" /> الدخول: {item.checkIn}</p>
                  <p><FaSignOutAlt className="ms-2 text-danger" /> الخروج: {item.checkOut}</p>
                  <p>
                    {item.lateMinutes > 0 ? (
                      <>
                        <FaClock className="ms-2 text-warning" />
                        <span className="badge bg-warning text-white">متأخر</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="ms-2 text-success" />
                        <span className="badge bg-success">حاضر</span>
                      </>
                    )}
                  </p>
                  <p className="text-secondary">
                    <FaCalendarAlt className="ms-2 text-secondary" /> التاريخ: {new Date(item.date).toLocaleDateString("ar-EG")}
                  </p>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      style={{ backgroundColor: "#fd7e14", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => handleEdit(item)}
                    >
                      تعديل
                    </button>
                    <button
                      style={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => handleDelete(item._id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">لا يوجد حضور</p>
        )}
      </div>

      {attendanceToday.length >= itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ direction: "rtl" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header position-relative">
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => {
                      setShowModal(false);
                      reset();
                    }}
                  ></button>
                  <h5 className="modal-title position-absolute top-50 start-50 translate-middle">
                    {isEditing ? "تعديل الحضور" : "إضافة حضور"}
                  </h5>
                </div>

                <div className="modal-body">
                  {!isEditing && (
                    <div className="mb-3">
                      <label className="form-label">اسم الموظف</label>
                      <select className="form-select" {...register("employeeId", { required: true })}>
                        <option value="">اختر موظفًا</option>
                        {employees.map((emp) => (
                          <option key={emp._id} value={emp._id}>{emp.name}</option>
                        ))}
                      </select>
                      {errors.employeeId && <small className="text-danger">يجب اختيار موظف</small>}
                    </div>
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

export default Attendance;
