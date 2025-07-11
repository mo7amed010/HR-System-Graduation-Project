import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "../apis/config";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("اسم المستخدم مطلوب")
    .matches(
      /^[A-Za-z][A-Za-z0-9_]*$/,
      "اسم المستخدم يجب أن يبدأ بحرف ويحتوي فقط على أحرف وأرقام وشرطات سفلية"
    )
    .min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل")
    .max(20, "اسم المستخدم يجب ألا يزيد عن 20 حرف"),
  fullName: yup
    .string()
    .required("الاسم بالكامل مطلوب")
    .matches(
      /^[\u0621-\u064A\u0660-\u0669A-Za-z\s]+$/,
      "الاسم بالكامل يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"
    )
    .min(5, "الاسم بالكامل يجب أن يكون 5 أحرف على الأقل")
    .max(50, "الاسم بالكامل يجب ألا يزيد عن 50 حرف"),
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة"),
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
    .matches(
      /[^A-Za-z0-9]/,
      "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"
    ),
  passwordConfirm: yup
    .string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([yup.ref("password")], "كلمتا المرور غير متطابقتين"),
});

const AddAdmin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [message, setMessage] = React.useState("");

  const onSubmit = async (data) => {
    setMessage("");
    try {
      await axiosInstance.post("/add-admin", data);
      setMessage("تمت الإضافة بنجاح");
      reset();
    } catch (err) {
      console.log("API error:", err.response);
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => {
          setError(e.param, { type: "manual", message: e.msg });
        });
        setMessage("");
      } else if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("حدث خطأ غير متوقع");
      }
    }
  };

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", padding: 40 }}>
      <div
        style={{
          maxWidth: 500,
          margin: "auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px #eee",
          padding: 32,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 32 }}>
          إضافة مسؤول جديد
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ float: "right" }}>اسم المستخدم</label>
            <input
              {...register("username")}
              placeholder="ادخل اسم المستخدم"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #eee",
              }}
            />
            {errors.username && (
              <div style={{ color: "#d32f2f", fontSize: 13 }}>
                {errors.username.message}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ float: "right" }}>الاسم بالكامل</label>
            <input
              {...register("fullName")}
              placeholder="ادخل الاسم الكامل"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #eee",
              }}
            />
            {errors.fullName && (
              <div style={{ color: "#d32f2f", fontSize: 13 }}>
                {errors.fullName.message}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ float: "right" }}>البريد الإلكتروني</label>
            <input
              {...register("email")}
              placeholder="example@email.com"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #eee",
              }}
            />
            {errors.email && (
              <div style={{ color: "#d32f2f", fontSize: 13 }}>
                {errors.email.message}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ float: "right" }}>كلمة المرور</label>
            <input
              {...register("password")}
              type="password"
              placeholder="ادخل كلمة المرور"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #eee",
              }}
            />
            {errors.password && (
              <div style={{ color: "#d32f2f", fontSize: 13 }}>
                {errors.password.message}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 30 }}>
            <label style={{ float: "right" }}>تأكيد كلمة المرور</label>
            <input
              {...register("passwordConfirm")}
              type="password"
              placeholder="أعد كتابة كلمة المرور"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #eee",
              }}
            />
            {errors.passwordConfirm && (
              <div style={{ color: "#d32f2f", fontSize: 13 }}>
                {errors.passwordConfirm.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              background: "#2196f3",
              color: "#fff",
              padding: 12,
              border: "none",
              borderRadius: 4,
              fontSize: 16,
            }}
          >
            حفظ
          </button>
        </form>
        {message && (
          <div style={{ marginTop: 20, color: "#d32f2f", textAlign: "center" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAdmin;
