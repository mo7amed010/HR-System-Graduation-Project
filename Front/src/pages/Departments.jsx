import React, { useState, useEffect } from "react";
import axios from "../apis/config";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import styles from "./Departments.module.css";

function Departments() {
  const [departments, setDepartments] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/api/departments/");
      setDepartments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data) => {
    if (isEditing) {
      try {
        await axios.put(`/api/departments/${currentId}`, { name: data.name });
        Swal.fire("تم التعديل!", "القسم تم تعديله.", "success");

        setIsEditing(false);
        setCurrentId(null);
        setShowModal(false);
        reset();

        fetchDepartments();
      } catch (err) {
        console.log(err);
        Swal.fire("فشل التعديل!", "حدث خطأ في التعديل.", "error");
      }
    } else {
      try {
        await axios.post("/api/departments/", { name: data.name });
        Swal.fire("تمت الإضافة!", "القسم تم اضافته.", "success");

        setShowModal(false);
        reset({ name: "" });
        fetchDepartments();
      } catch (err) {
        console.log(err);
        Swal.fire("فشل الإضافة!", "حدث خطأ في الإضافة.", "error");
      }
    }
  };

  const handleEdit = (dep) => {
    setIsEditing(true);
    setCurrentId(dep._id);
    reset({ name: dep.name });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/departments/${id}`);

      Swal.fire("تم الحذف!", "القسم تم حذفه.", "success");

      setDepartments((prev) => prev.filter((dep) => dep._id !== id));
    } catch (err) {
      console.log(err);
      Swal.fire("فشل الحذف!", "حدث خطأ في الحذف.", "error");
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerWrapper}>
        <h1 className={styles.mainHeader}>الأقسام</h1>
        <button
          onClick={() => {
            setIsEditing(false);
            reset({ name: "" });
            setShowModal(true);
          }}
          className={styles.addButton}
        >
          إضافة قسم
        </button>
      </div>

      <div className={styles.outerWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.tableCell}>رقم</th>
              <th className={styles.tableCell}>القسم</th>
              <th className={styles.tableCell}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {departments?.map((dep, idx) => (
              <tr
                key={dep._id}
                className={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
              >
                <td className={styles.tableCell}>{idx + 1}</td>
                <td className={styles.tableCell}>{dep.name}</td>
                <td className={styles.tableCell}>
                  <button
                    onClick={() => handleEdit(dep)}
                    className={styles.btnEdit}
                  >
                    <FaEdit /> تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(dep._id)}
                    className={styles.btnDelete}
                  >
                    <FaTrash /> حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{isEditing ? "تعديل القسم" : "إضافة قسم"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("name", { required: "اسم القسم مطلوب" })}
                placeholder="اكتب اسم القسم"
                className={styles.formControl}
              />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}

              <div className={styles.buttons}>
                <button
                  type="submit"
                  className={isEditing ? styles.btnEdit : styles.btnAdd}
                >
                  {isEditing ? "تعديل" : "إضافة"}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className={styles.btnCancel}
                  type="button"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;
