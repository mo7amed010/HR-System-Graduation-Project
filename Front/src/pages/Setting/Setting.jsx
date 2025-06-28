import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Setting.module.css";
import { FaEdit } from "react-icons/fa";
import Swal from 'sweetalert2';

const Setting = () => {
  const daysOfWeek = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const [initialValues, setInitialValues] = useState({
    method: "",
    add: "",
    deduct: "",
    offDay1: "",
    offDay2: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3003/generalSetting/", {
          headers: { }
        });
        
        if (response.data && response.data.data) {
          const dataArr = response.data.data;
          const data = Array.isArray(dataArr) && dataArr.length > 0 ? dataArr[0] : {};
          setInitialValues({
            add: data.add || "",
            deduct: data.deduct || "",
            offDay1: data.offDay1 || "",
            offDay2: data.offDay2 || "",
            method: data.method || "",
          });
        } else {
          setInitialValues({
            add: "",
            deduct: "",
            offDay1: "",
            offDay2: "",
            method: "money",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطأ في تحميل البيانات",
          text: "فشل في تحميل الإعدادات من الخادم",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const validationSchema = Yup.object({
    method: Yup.string().required("طريقة الإضافة مطلوبة"),
    add: Yup.number().required("قيمة الإضافة مطلوبة"),
    deduct: Yup.number().required("قيمة الخصم مطلوبة"),
    offDay1: Yup.string().required("اليوم الأول مطلوب"),
    offDay2: Yup.string().notOneOf(
      [Yup.ref("offDay1")],
      "لا يمكن اختيار نفس اليوم مرتين"
    ),
  });
  const handleSubmit = (values) => {
    const payload = {
      ...values,
      add: Number(values.add),
      deduct: Number(values.deduct),
    };
    if (values.offDay2 === "لا يوجد") {
      payload.offDay2 = "";
    }
    
    axios.put("http://localhost:3003/generalSetting/", payload, {
      headers: { }
    })
      .then((res) => {
        console.log("Update response:", res);
        Swal.fire({
          icon: "success",
          title: "تم الحفظ!",
          text: "تم حفظ الإعدادات بنجاح",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#047FCC",
        });
      })
      .catch((err) => {
        console.error("فشل في حفظ الإعدادات:", err);
        Swal.fire({
          icon: "error",
          title: "حدث خطأ!",
          text: "فشل في حفظ الإعدادات",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#d33",
        });
      });
  };

  const validateAndSubmit = (values, validateForm, handleSubmit) => {
    validateForm(values).then((errors) => {
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join('<br/>');
        Swal.fire({
          icon: "error",
          title: "خطأ في البيانات",
          html: errorMessages,
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#d33",
        });
        return;
      }
      handleSubmit();
    });
  };

  return (
    <div className={`container mt-4 ${styles.container}`} dir="rtl">
      <h1 className={`text-center p-2 rounded ${styles.title}`}>
        إعدادات عامة
      </h1>
       
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            validateForm,
          }) => (
            <form>
              <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label " style={{ color: "#60656D" }}>الإضافة:</label>
                <div className="col-sm-10 d-flex gap-2">
                  <input type="number" name="add" className="form-control"
                    placeholder="قيمة الإضافة" value={values.add} onChange={handleChange}onBlur={handleBlur}/>
                  <div>
                    <select
                      name="method" className={`form-select form-select-sm ${styles.formSelect}`} value={values.method}
                      onChange={handleChange} onBlur={handleBlur}>
                      <option value="money">جنيه</option>
                      <option value="hours">ساعة</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <label className="col-sm-2 col-form-label" style={{ color: "#60656D" }}> الخصم:</label>
                <div className="col-sm-10 d-flex gap-2">
                  <input type="number" name="deduct" className="form-control"
                    placeholder="قيمة الخصم" value={values.deduct} onChange={handleChange} onBlur={handleBlur}/>
                  <div>
                    <select name="method" className={`form-select form-select-sm ${styles.formSelect}`}
                      value={values.method} onChange={handleChange} onBlur={handleBlur}>
                      <option value="money">جنيه</option>
                      <option value="hours">ساعة</option>
                    </select>
                  </div>
                </div>
              </div>
              <h5 className="my-3 text-center">الإجازات الأسبوعية</h5>
              <div className="row mb-3 my-5">
                <label className={`col-sm-2 ${styles.titleDay} `}>  اليوم الاجازة الرسمي 1:</label>
                <div className={`col-sm-10  `}>
                  <select name="offDay1" className={`form-select ${styles.formSelect2}`}
                    value={values.offDay1} onChange={handleChange} onBlur={handleBlur} >
                    {daysOfWeek.map((day, i) => (
                      <option key={i} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <label className={`col-sm-2  ${styles.titleDay} `}>  اليوم الاجازة الرسمي 2: </label>
                <div className={`col-sm-10 `}>
                  <select name="offDay2" className={`form-select ${styles.formSelect2}`}
                    value={values.offDay2} onChange={handleChange} onBlur={handleBlur}>
                    <option value="">لا يوجد</option>
                    {daysOfWeek.map((day, i) => (
                      <option key={i} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-center">
                <button type="button" className={`btn ${styles.submitButton}`} onClick={() => validateAndSubmit(values, validateForm, handleSubmit)}>
                  <FaEdit className="me-2" />حفظ التغييرات
                </button>
              </div>
            </form>
          )}
        </Formik>

    </div>
  );
};

export default Setting;
