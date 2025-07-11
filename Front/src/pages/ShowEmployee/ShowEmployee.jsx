import React, { useEffect, useState } from "react";
import axiosInstance from "../../apis/config";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./ShowEmployee.module.css";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const ShowEmployee = ({ onEdit, onAddEmployeeClick, onEditEmployee }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/employee");
        setEmployees(res.data.data || []);
      } catch (err) {
        setEmployees([]);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get("api/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("خطأ  في  الأقسام:", error);
      }
    };
    fetchDepartments();
  }, []);

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d._id === id);
    return dept ? dept.name : "قسم غير معروف";
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا الموظف بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/employee/${id}`);
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف الموظف بنجاح.",
          icon: "success",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#3085d6",
        });
      } catch (err) {
        Swal.fire({
          title: "حدث خطأ!",
          text: "فشل حذف الموظف، حاول مرة أخرى.",
          icon: "error",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.mainHeader}>الموظفين</h1>
      <button
        className={styles.btnAdd}
        onClick={() => {
          if (onAddEmployeeClick) {
            onAddEmployeeClick();
          } else {
            navigate("/add");
          }
        }}
      >
        <FaPlus className={styles.iconAdd} /> إضافة موظف
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>اسم الموظف</th>
            <th>  الوظيفة</th>
            <th>  القسم </th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.jobTitle}</td>
                <td>{getDepartmentName(emp.department)}</td>
                <td>
                  <button
                    className={styles.btnEdit}
                    onClick={() => {
                      if (onEditEmployee) {
                        onEditEmployee(emp._id);
                      } else {
                        navigate(`/add/${emp._id}`);
                      }
                    }}
                  >
                    <FaEdit /> تعديل
                  </button>
                  <button
                    className={styles.btnDelete}
                    onClick={() => handleDelete(emp._id)}
                  >
                    <FaTrash /> حذف
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                لا توجد بيانات
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShowEmployee;