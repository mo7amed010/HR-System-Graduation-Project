import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./AddEmployee.module.css";
import WorkDetailes from "../WorkDetailes/WorkDetailes";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaTransgender,
  FaFlag,
  FaCalendarAlt,
  FaIdCardAlt,
  FaTrash,
  FaEdit,
  FaSave,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";

const AddEmployee = () => {
  const workDetailsRef = useRef(null); // Create a ref for WorkDetailes

  const headers = {
    "Content-Type": "application/json",
  };

  const formik1 = useFormik({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      gender: "",
      nationality: "",
      dob: "",
      ssn: "",
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
    onSubmit: async (values) => {
      try {
        const res = await axios.post(
          "http://localhost:3003/employee/add",
          values,
          {
            headers,
          }
        );
        alert("Employee added!");
      } catch (err) {
        console.error(err.response.data);
        alert("Error adding employee.");
      }
    },
  });

  const handleSave = async () => {
    const workErrors = await workDetailsRef.current.validate();
    const personalErrors = await formik1.validateForm();

    if (Object.keys(workErrors).length || Object.keys(personalErrors).length) {
      alert("يرجى تصحيح الأخطاء في النماذج");
      return;
    }

    const combinedValues = {
      ...formik1.values,
      ...workDetailsRef.current.getValues(),
    };

    try {
      const res = await axios.post(
        "http://localhost:3003/employee/add",
        combinedValues,
        {
          headers,
        }
      );
      alert("تم حفظ بيانات الموظف بنجاح!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("حدث خطأ أثناء حفظ البيانات.");
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <h1 className={styles.mainHeader}>
        <FaUsers /> الموظفين
      </h1>
      <div className="row justify-content-center">
        {/* النموذج الأول (البيانات الأساسية) */}
        <div className="col-md-4">
          {" "}
          {/* Adjusted width for better layout */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <FaUser /> البيانات الأساسية
            </div>

            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaUser className={styles.inputIcon} /> اسم الموظف
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={formik1.handleChange}
                  value={formik1.values.name}
                  className={styles.formControl}
                  placeholder="أدخل اسم الموظف"
                />
                {formik1.errors.name && (
                  <div className={styles.error}>{formik1.errors.name}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaMapMarkerAlt className={styles.inputIcon} /> العنوان
                </label>
                <input
                  type="text"
                  name="address"
                  onChange={formik1.handleChange}
                  value={formik1.values.address}
                  className={styles.formControl}
                  placeholder="أدخل العنوان"
                />
                {formik1.errors.address && (
                  <div className={styles.error}>{formik1.errors.address}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaPhone className={styles.inputIcon} /> رقم التليفون
                </label>
                <input
                  type="text"
                  name="phone"
                  onChange={formik1.handleChange}
                  value={formik1.values.phone}
                  className={styles.formControl}
                  placeholder="أدخل رقم التليفون"
                />
                {formik1.errors.phone && (
                  <div className={styles.error}>{formik1.errors.phone}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaTransgender className={styles.inputIcon} /> النوع
                </label>
                <select
                   name="gender"
                    onChange={formik1.handleChange}
                   value={formik1.values.gender}
                   className={styles.formSelect}
                >
                  <option value="">اختر النوع</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                 </select>

                {formik1.errors.gender && (
                  <div className={styles.error}>{formik1.errors.gender}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaFlag className={styles.inputIcon} /> الجنسية
                </label>
                <input
                  type="text"
                  name="nationality"
                  onChange={formik1.handleChange}
                  value={formik1.values.nationality}
                  className={styles.formControl}
                  placeholder="أدخل الجنسية"
                />
                {formik1.errors.nationality && (
                  <div className={styles.error}>
                    {formik1.errors.nationality}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaCalendarAlt className={styles.inputIcon} /> تاريخ الميلاد
                </label>
                <input
                  type="date"
                  name="dob"
                  onChange={formik1.handleChange}
                  value={formik1.values.dob}
                  className={styles.formControl}
                />
                {formik1.errors.dob && (
                  <div className={styles.error}>{formik1.errors.dob}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FaIdCardAlt className={styles.inputIcon} /> الرقم القومي
                </label>
                <input
                  type="text"
                  name="ssn"
                  onChange={formik1.handleChange}
                  value={formik1.values.ssn}
                  className={styles.formControl}
                  placeholder="أدخل الرقم القومي"
                />
                {formik1.errors.ssn && (
                  <div className={styles.error}>{formik1.errors.ssn}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* استدعاء النموذج الثاني (بيانات العمل) */}
        <div className="col-md-4">
          {" "}
          {/* Adjusted width for better layout */}
          <WorkDetailes ref={workDetailsRef} />
        </div>
      </div>

      {/* أزرار الإجراءات */}
      <div className="row mt-0">
        {" "}
        {/* Adjusted margin for better spacing */}
        <div className="col-12">
          <div className={styles.buttons}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
            >
              <FaTrash /> حذف
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              <FaEdit /> تعديل
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`${styles.btn} ${styles.btnSuccess}`}
            >
              <FaSave /> حفظ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
