import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./ShowEmployee.module.css";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Swal from 'sweetalert2';


const ShowEmployee = ({ onEdit }) => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3003/employee/");
      console.log("data:", res.data);
      setEmployees(res.data.data || []);
    } catch (err) {
      setEmployees([]);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'هل أنت متأكد؟',
    text: 'لن تتمكن من استعادة هذا الموظف بعد الحذف!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، احذف',
    cancelButtonText: 'إلغاء',
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:3003/employee/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      Swal.fire({
        title: 'تم الحذف!',
        text: 'تم حذف الموظف بنجاح.',
        icon: 'success',
        confirmButtonText: 'حسنًا',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      Swal.fire({
        title: 'حدث خطأ!',
        text: 'فشل حذف الموظف، حاول مرة أخرى.',
        icon: 'error',
        confirmButtonText: 'حسنًا',
        confirmButtonColor: '#3085d6',
      });
    }
  }
};


  return (
    <div className={styles.container} dir="rtl">
       <h1 className={styles.mainHeader}>
                   الموظفين 
       </h1> 
      <button
  className={styles.btnAdd}
  onClick={() => navigate("/add")}
>
 <FaPlus className={styles.iconAdd} />  إضافة موظف
</button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>اسم الموظف</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp._id}>
                 <td>{emp.name}</td>
                <td>
                  <button className={styles.btnEdit} onClick={() => navigate(`/add/${emp._id}`)}>
                    <FaEdit /> تعديل
                  </button>
                  <button className={styles.btnDelete} onClick={() => handleDelete(emp._id)}>
                    <FaTrash /> حذف
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
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