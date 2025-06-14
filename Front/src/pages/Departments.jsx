
import React, { useState, useEffect } from "react";
import axios from "../apis/config";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

function Departments() {
  const [departments, setDepartments] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showModal, setShowModal] = useState(false); 

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

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
        reset({ name: '' }); 
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
    <div style={{ direction:'rtl', padding:'20px', margin:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <h1 style={{ color: "#069ED3", margin:'0' }}>الأقسام</h1>
        <button
          onClick={() => { 
            setIsEditing(false);
            reset({ name: '' }); 
            setShowModal(true);
          }}
          style={{ backgroundColor: "#047FCC", color:'white', padding:'10px 20px', border:'none', borderRadius:'5px', cursor:'pointer'}}
        >
          إضافة قسم
        </button>
      </div>

      <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'center', fontSize:'1.1rem' }}>
        <thead style={{ backgroundColor: "#047FCC", color:'white' }}>
          <tr>
            <th style={{ padding:'10px' }}>رقم</th>
            <th style={{ padding:'10px' }}>القسم</th>
            <th style={{ padding:'10px' }}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {departments?.map((dep, idx) => (
            <tr key={dep._id} style={{ backgroundColor: idx % 2 === 0 ? "#E6E6E6" : "#F5F5F5" }}>
              <td style={{ padding:'10px' }}>{idx + 1}</td>
              <td style={{ padding:'10px' }}>{dep.name}</td>
              <td style={{ padding:'10px' }}>
                <button
                   onClick={() => handleEdit(dep)}
                   style={{ background:'none', color: "#FFA500", border:'none', marginLeft:'10px', cursor:'pointer'}}
                 >
                   <FaEdit size={20} />
                 </button>
                 <button
                   onClick={() => handleDelete(dep._id)}
                   style={{ background:'none', color:'red', border:'none', cursor:'pointer'}}
                 >
                   <FaTrash size={20} />
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div 
          style={{ 
            position:'fixed',
            top:'0',
            left:'0',
            width:'100%',
            height:'100%',
            background:'rgba(0,0,0,0.5)', 
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
          }}>
          <div style={{ background:'white', padding:'20px', borderRadius:'10px', width:'400px' }}>
            <h2>{isEditing ? "تعديل القسم" : "إضافة قسم"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("name", { required:'اسم القسم مطلوب' })}
                placeholder="اكتب اسم القسم"
                style={{ padding:'10px', border:'1px solid #069ED3', borderRadius:'5px', width:'100%' }}
              />
              {errors.name && <span style={{ color:'red' }}>{errors.name.message}</span>}

              <div style={{ marginTop:'20px', display:'flex', justifyContent:'space-between' }}>
                 <button
                   type="submit"
                   style={{ backgroundColor:isEditing ? "#FFA500" : "#069ED3", color:'white', padding:'10px 20px', border:'none', borderRadius:'5px', cursor:'pointer'}}

                 >
                   {isEditing ? "تعديل" : "إضافة"}
                 </button>


                <button
                   onClick={() => setShowModal(false)}
                   style={{ background:'none', color:'red', border:'none', cursor:'pointer'}}
                   type="button">
                   إلغاء
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Departments;

