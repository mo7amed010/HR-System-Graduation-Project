import React, { useImperativeHandle, forwardRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "../EmployeeDetails/EmployeeDetails.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBriefcase, FaBuilding, FaCalendarAlt, FaClock, FaDollarSign,} from "react-icons/fa";
import { IoIosHourglass } from "react-icons/io";

const WorkDetailes = forwardRef((props, ref) => {
  const validationSchema = Yup.object({
    hiredDate: Yup.date()
      .min(new Date("2008-01-02"), "يجب أن يكون بعد 2 يناير 2008")
      .required("تاريخ التعيين مطلوب"),
    department: Yup.string().required("يجب اختيار القسم"),
    salary: Yup.number()
      .min(0, "يجب أن يكون الراتب رقمًا موجبًا")
      .required("يجب إدخال الراتب"),
    jobTitle: Yup.string().required("يجب إدخال المنصب"),
    checkIn: Yup.string()
      .required("وقت الحضور مطلوب")
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "أدخل وقت الحضور بالشكل التالي: ساعة:دقيقة (مثال: 09:00)"
      ),
    checkOut: Yup.string()
      .required("وقت الانصراف مطلوب")
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "أدخل وقت الانصراف بالشكل التالي: ساعة:دقيقة (مثال: 17:00)"
      ),
  });

  const formik = useFormik({
    initialValues: { hiredDate: "", department: "", salary: "", jobTitle: "", checkIn: "", checkOut: "",},
    validationSchema,
    onSubmit: () => {},
  });

useImperativeHandle(ref, () => ({
  getValues: () => formik.values,
  validate: async () => {
    try {
      await validationSchema.validate(formik.values, { abortEarly: false });
      formik.setErrors({});
      return {};
    } catch (validationError) {
      const formattedErrors = {};
      validationError.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      formik.setErrors(formattedErrors);
      return formattedErrors;
    }
  },
  resetForm: () => {
    formik.resetForm();
  },
  setValues: (values) => {
      console.log("Setting values in WorkDetailes:", values);
    formik.setValues(values);
  },
}));


  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3003/api/departments/"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("خطأ  في  الأقسام:", error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <FaBriefcase /> بيانات العمل
      </div>

      <div className={styles.cardBody}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <FaCalendarAlt className={styles.inputIcon} /> تاريخ التعاقد
          </label>
          <input type="date" name="hiredDate"  onChange={formik.handleChange}  value={formik.values.hiredDate}  
          className={styles.formControl} />
          {formik.errors.hiredDate && (
            <div className={styles.error}>{formik.errors.hiredDate}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <FaDollarSign className={styles.inputIcon} /> الراتب
          </label>
          <input  type="number" name="salary" onChange={formik.handleChange} value={formik.values.salary} className={styles.formControl}/>
          {formik.errors.salary && (
            <div className={styles.error}>{formik.errors.salary}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <FaClock className={styles.inputIcon} /> موعد الحضور
          </label>
          <input type="text" name="checkIn" onChange={formik.handleChange} value={formik.values.checkIn} 
          className={styles.formControl} placeholder="مثال: 09:00"/>
          {formik.errors.checkIn && (
            <div className={styles.error}>{formik.errors.checkIn}</div> )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <IoIosHourglass className={styles.inputIcon} /> موعد الانصراف
          </label>
          <input type="text" name="checkOut" onChange={formik.handleChange} value={formik.values.checkOut}
            className={styles.formControl} placeholder="مثال: 17:00" />
          {formik.errors.checkOut && (
            <div className={styles.error}>{formik.errors.checkOut}</div> )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <FaBuilding className={styles.inputIcon} /> القسم
          </label>
          <select name="department"onChange={formik.handleChange} value={formik.values.department} className={`form-select ${styles.formSelect}`}>
            <option value="">اختر القسم</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>

          {formik.errors.department && (
            <div className={styles.error}>{formik.errors.department}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <FaBriefcase className={styles.inputIcon} /> المنصب
          </label>
          <input  type="text" name="jobTitle" onChange={formik.handleChange} value={formik.values.jobTitle} className={styles.formControl} placeholder="أدخل المنصب"/>
          {formik.errors.jobTitle && (
            <div className={styles.error}>{formik.errors.jobTitle}</div>
          )}
        </div>
      </div>
    </div>
  );
});

export default WorkDetailes;
