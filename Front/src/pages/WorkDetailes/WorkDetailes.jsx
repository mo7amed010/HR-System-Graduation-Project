import React, { useImperativeHandle, forwardRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from '../AddEmployee/AddEmployee.module.css';
import { FaBriefcase, FaBuilding, FaCalendarAlt, FaClock, FaDollarSign } from 'react-icons/fa';
import { IoIosHourglass } from 'react-icons/io';

const WorkDetailes = forwardRef((props, ref) => {
  const validationSchema = Yup.object({
    hiredDate: Yup.date()
      .min(new Date('2008-01-02'), 'يجب أن يكون بعد 2 يناير 2008')
      .required('تاريخ التعيين مطلوب'),
    department: Yup.string().required('يجب اختيار القسم'),
    salary: Yup.number()
      .min(0, 'يجب أن يكون الراتب رقمًا موجبًا')
      .required('يجب إدخال الراتب'),
    jobTitle: Yup.string().required('يجب إدخال المنصب'),
    checkIn: Yup.string()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)(AM|PM)$/i, 'تنسيق الوقت غير صحيح')
      .required('موعد الحضور مطلوب'),
    checkOut: Yup.string()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)(AM|PM)$/i, 'تنسيق الوقت غير صحيح')
      .required('موعد الانصراف مطلوب'),
    qualification: Yup.string().required('يجب إدخال المؤهل العلمي'),
  });

  const formik = useFormik({
    initialValues: {
      hiredDate: '',
      department: '',
      salary: '',
      jobTitle: '',
      checkIn: '',
      checkOut: '',
      qualification: '',
    },
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
  }));

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <FaBriefcase /> بيانات العمل
      </div>

      <div className={styles.cardBody}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}><FaCalendarAlt className={styles.inputIcon} /> تاريخ التعاقد</label>
          <input
            type="date"
            name="hiredDate"
            onChange={formik.handleChange}
            value={formik.values.hiredDate}
            className={styles.formControl}
          />
          {formik.errors.hiredDate && <div className={styles.error}>{formik.errors.hiredDate}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}><FaDollarSign className={styles.inputIcon} /> الراتب</label>
          <input
            type="number"
            name="salary"
            onChange={formik.handleChange}
            value={formik.values.salary}
            className={styles.formControl}
          />
          {formik.errors.salary && <div className={styles.error}>{formik.errors.salary}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}><FaClock className={styles.inputIcon} /> موعد الحضور</label>
          <input
            type="text"
            name="checkIn"
            onChange={formik.handleChange}
            value={formik.values.checkIn}
            className={styles.formControl}
            placeholder="مثال: 09:00AM"
          />
          {formik.errors.checkIn && <div className={styles.error}>{formik.errors.checkIn}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}><IoIosHourglass className={styles.inputIcon} /> موعد الانصراف</label>
          <input
            type="text"
            name="checkOut"
            onChange={formik.handleChange}
            value={formik.values.checkOut}
            className={styles.formControl}
            placeholder="مثال: 05:00PM"
          />
          {formik.errors.checkOut && <div className={styles.error}>{formik.errors.checkOut}</div>}
        </div>
{/* 
        <div className={styles.formGroup}>
          <label className={styles.formLabel}><FaBuilding className={styles.inputIcon} /> القسم</label>
          <select
  name="department"
  onChange={formik.handleChange}
  value={formik.values.department}
  className={styles.formSelect}
>
  <option value="">اختر القسم</option>
  {departments.map((dept) => (
    <option key={dept._id} value={dept._id}>
      {dept.name}
    </option>
  ))}
</select>
          {formik.errors.department && <div className={styles.error}>{formik.errors.department}</div>}
        </div> */}

        <div className={styles.formGroup}>
          <label className={styles.formLabel}><FaBriefcase className={styles.inputIcon} /> المنصب</label>
          <input
            type="text"
            name="jobTitle"
            onChange={formik.handleChange}
            value={formik.values.jobTitle}
            className={styles.formControl}
            placeholder="أدخل المنصب"
          />
          {formik.errors.jobTitle && <div className={styles.error}>{formik.errors.jobTitle}</div>}
        </div>
      </div>
    </div>
  );
});

export default WorkDetailes;
