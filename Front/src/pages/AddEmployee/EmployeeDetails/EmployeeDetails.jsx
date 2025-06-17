import React from "react"
import Swal from 'sweetalert2';
import { useFormik } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./EmployeeDetails.module.css";
import WorkDetailes from "../WorkDetailes/WorkDetailes";
import axios from "axios";
import { useParams } from "react-router-dom";
import  { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,FaMapMarkerAlt,FaPhone,FaTransgender,FaFlag,FaCalendarAlt,
  FaIdCardAlt,FaSave,FaUsers,
} from "react-icons/fa";

const AddEmployee = () => {
  const workDetailsRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const headers = {
    "Content-Type": "application/json",
  };

  const EmployeeDetails = useFormik({
  initialValues: {
    name: "", address: "", phone: "", gender: "", nationality: "", dob: "", ssn: "",
  },
  validationSchema: Yup.object({
    name: Yup.string().min(10).max(35).required("يجب إدخال اسم الموظف"),
    address: Yup.string().min(10).required("يجب إدخال العنوان"),
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, "يجب أن يتكون الرقم من 11 رقم")
      .required("يجب إدخال رقم التليفون"),
    gender: Yup.string()
      .oneOf(["male", "female"])
      .required("يجب اختيار النوع"),
    nationality: Yup.string().min(3).required("يجب إدخال الجنسية"),
    dob: Yup.date()
      .max(new Date("2005-01-01"), "يجب أن يكون قبل 1 يناير 2005")
      .min(new Date("1920-01-01"), "يجب أن يكون بعد 1 يناير 1920")
      .required("تاريخ الميلاد مطلوب"),
    ssn: Yup.string().length(14).required("يجب إدخال الرقم القومي"),
  }),
});

 const handleSave = async () => {
  try {
    if (!workDetailsRef.current) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ!',
        text: 'Work details form is not initialized',
        confirmButtonText: 'حسنًا',
        confirmButtonColor: '#047FCC',
      });
      return;
    }
    if (!/^[0-9]{11}$/.test(EmployeeDetails.values.phone)) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ!',
        text: 'يجب أن يتكون رقم التليفون من 11 رقم',
        confirmButtonText: 'حسنًا',
        confirmButtonColor: '#047FCC',
      });
      return;
    }
    if (!/^[0-9]{14}$/.test(EmployeeDetails.values.ssn)) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ!',
        text: 'يجب أن يتكون الرقم القومي من 14 رقم',
        confirmButtonText: 'حسنًا',
        confirmButtonColor: '#047FCC',
      });
      return;
    }

    const workErrors = await workDetailsRef.current.validate();
    const personalErrors = await EmployeeDetails.validateForm();

    if (Object.keys(workErrors).length > 0 || Object.keys(personalErrors).length > 0) {
      const allErrors = [
        ...Object.values(workErrors),
        ...Object.values(personalErrors)
      ];

      Swal.fire({
        icon: 'error',
        title: 'خطأ!',
        html: allErrors.map(error => `<p>${error}</p>`).join(''),
        confirmButtonText: 'حسنًا',
        confirmButtonColor: '#047FCC',
      });
      return;
    }

    const workDetails = workDetailsRef.current.getValues();
    const personalDetails = EmployeeDetails.values;

    const combinedData = {
      ...personalDetails,
      ...workDetails,
    };

    const url = id ? `http://localhost:3003/employee/${id}`  : "http://localhost:3003/employee/add";
    const method = id ? "put" : "post";
   try {
      const res = await axios[method](url, combinedData, { headers });

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'نجاح!',
          text: 'تم حفظ بيانات الموظف بنجاح!',
          confirmButtonText: 'حسنًا',
          confirmButtonColor: '#047FCC',
        });
        
        if (EmployeeDetails && typeof EmployeeDetails.resetForm === 'function') {
          EmployeeDetails.resetForm();
        }
        
        if (workDetailsRef.current && typeof workDetailsRef.current.resetForm === 'function') {
          workDetailsRef.current.resetForm();
        }

        navigate("/show");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data.error;
        if (errorMessage.includes('phone')) {
          Swal.fire({
            icon: 'error',
            title: 'خطأ!',
            text: 'رقم التليفون مستخدم من قبل',
            confirmButtonText: 'حسنًا',
            confirmButtonColor: '#047FCC',
          });
        } else if (errorMessage.includes('ssn')) {
          Swal.fire({
            icon: 'error',
            title: 'خطأ!',
            text: 'الرقم القومي مستخدم من قبل',
            confirmButtonText: 'حسنًا',
            confirmButtonColor: '#047FCC',
          });
        } else if (errorMessage.includes('checkIn')) {
          Swal.fire({
            icon: 'error',
            title: 'خطأ!',
            text: 'وقت الحضور مطلوب',
            confirmButtonText: 'حسنًا',
            confirmButtonColor: '#047FCC',
          });
        } else if (errorMessage.includes('checkOut')) {
          Swal.fire({
            icon: 'error',
            title: 'خطأ!',
            text: 'وقت الانصراف مطلوب',
            confirmButtonText: 'حسنًا',
            confirmButtonColor: '#047FCC',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'خطأ!',
            text: errorMessage || 'حدث خطأ أثناء حفظ البيانات',
            confirmButtonText: 'حسنًا',
            confirmButtonColor: '#047FCC',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطأ!',
          text: 'حدث خطأ في الاتصال بالخادم',
          confirmButtonText: 'حسنًا',
          confirmButtonColor: '#047FCC',
        });
      }
    }
  } catch (err) {
    console.error("خطأ في حفظ البيانات:", err.message);
    Swal.fire({
      icon: 'error',
      title: 'خطأ!',
      text: err.message || 'حدث خطأ أثناء حفظ البيانات.',
      confirmButtonText: 'حسنًا',
      confirmButtonColor: '#047FCC',
    });
  }
};

useEffect(() => {
  if (id) {
    axios.get(`http://localhost:3003/employee/${id}`)
      .then((res) => {
        const data = res.data.data;
        EmployeeDetails.setValues({
          name: data.name || "",address: data.address || "",phone: data.phone || "",gender: data.gender || "",
          nationality: data.nationality || "",dob: data.dob ? data.dob.substring(0, 10) : "",ssn: data.ssn || "",
        });
      workDetailsRef.current.setValues({
       hiredDate: data.hiredDate ? data.hiredDate.substring(0, 10) : "",
       department: data.department || "", salary: data.salary || "", jobTitle: data.jobTitle || "",
       checkIn: data.checkIn || "", checkOut: data.checkOut || "",
});

      })
      .catch((err) => {
        console.error("فشل في تحميل بيانات الموظف:", err);
      });
  }
}, [id]);

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.headerWrapper}>
        <h1 className={styles.mainHeader}>
          <FaUsers className={styles.icon} />   اضافه موظف
        </h1>
      </div>
      <div className={styles.outerWrapper}>
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className={styles.formWrapper}> 
              <div className={styles.card}>
                <div className={styles.cardTitle}>
                  <FaUser /> البيانات الأساسية
                </div>

                <div className={`${styles.formContainer} ${styles.cardBody}`}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaUser className={styles.inputIcon} /> اسم الموظف
                    </label>
                    <input type="text" name="name" onChange={EmployeeDetails.handleChange}
                      value={EmployeeDetails.values.name}  className={styles.formControl} placeholder="أدخل اسم الموظف" 
                    />
                    {EmployeeDetails.errors.name && (
                      <div className={styles.error}>{EmployeeDetails.errors.name}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaMapMarkerAlt className={styles.inputIcon} /> العنوان
                    </label>
                    <input  type="text"  name="address"  onChange={EmployeeDetails.handleChange}
                      value={EmployeeDetails.values.address} className={styles.formControl}  placeholder="أدخل العنوان" />
                    {EmployeeDetails.errors.address && (
                      <div className={styles.error}>{EmployeeDetails.errors.address}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaPhone className={styles.inputIcon} /> رقم التليفون
                    </label>
                    <input  type="text"  name="phone" onChange={EmployeeDetails.handleChange} value={EmployeeDetails.values.phone} 
                      className={styles.formControl} placeholder="أدخل رقم التليفون"/>
                    {EmployeeDetails.errors.phone && (
                      <div className={styles.error}>{EmployeeDetails.errors.phone}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaTransgender className={styles.inputIcon} /> النوع
                    </label>
                    <select  name="gender"  onChange={EmployeeDetails.handleChange} value={EmployeeDetails.values.gender}  className={`form-select ${styles.formSelect}`}>
                      <option value="">اختر النوع</option>
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                    {EmployeeDetails.errors.gender && (
                      <div className={styles.error}>{EmployeeDetails.errors.gender}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaFlag className={styles.inputIcon} /> الجنسية
                    </label>
                    <input  type="text" name="nationality" onChange={EmployeeDetails.handleChange}
                     value={EmployeeDetails.values.nationality} className={styles.formControl}placeholder="أدخل الجنسية"/>
                    {EmployeeDetails.errors.nationality && (
                      <div className={styles.error}>{EmployeeDetails.errors.nationality}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaCalendarAlt className={styles.inputIcon} /> تاريخ الميلاد
                    </label>
                    <input 
                      type="date"name="dob"  onChange={EmployeeDetails.handleChange}value={EmployeeDetails.values.dob} 
                        className={styles.formControl} />
                    {EmployeeDetails.errors.dob && (
                      <div className={styles.error}>{EmployeeDetails.errors.dob}</div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <FaIdCardAlt className={styles.inputIcon} /> الرقم القومي
                    </label>
                    <input type="text"name="ssn"  onChange={EmployeeDetails.handleChange} value={EmployeeDetails.values.ssn}
                      className={styles.formControl}  placeholder="أدخل الرقم القومي" />
                    {EmployeeDetails.errors.ssn && (
                      <div className={styles.error}>{EmployeeDetails.errors.ssn}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className={styles.formWrapper}>
             <WorkDetailes ref={workDetailsRef} />

            </div>
          </div>
        </div>
        
        <div className="row mt-0">
          <div className="col-12">
            <div className={styles.buttons}>
              <button  type="button" onClick={handleSave} className={`${styles.btn} ${styles.btnSuccess}`}>
                <FaSave /> حفظ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;