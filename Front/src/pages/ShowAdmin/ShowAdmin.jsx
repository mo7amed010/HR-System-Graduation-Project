import React, { useEffect, useState } from "react";
import axiosInstance from "../../apis/config";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import styles from "./ShowAdmin.module.css";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schemas
const editSchema = yup.object().shape({
    username: yup
        .string()
        .required("اسم المستخدم مطلوب")
        .matches(/^[A-Za-z][A-Za-z0-9_]*$/, "اسم المستخدم يجب أن يبدأ بحرف ويحتوي فقط على أحرف وأرقام وشرطات سفلية")
        .min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل")
        .max(20, "اسم المستخدم يجب ألا يزيد عن 20 حرف"),
    fullName: yup
        .string()
        .required("الاسم بالكامل مطلوب")
        .matches(/^[\u0621-\u064A\u0660-\u0669A-Za-z\s]+$/, "الاسم بالكامل يجب أن يحتوي على أحرف عربية أو إنجليزية فقط")
        .min(5, "الاسم بالكامل يجب أن يكون 5 أحرف على الأقل")
        .max(50, "الاسم بالكامل يجب ألا يزيد عن 50 حرف"),
    email: yup.string().required("البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
    password: yup
        .string()
        .notRequired()
        .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
        .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
        .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
        .matches(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
        .matches(/[^A-Za-z0-9]/, "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل")
        .nullable(),
});

const addSchema = yup.object().shape({
    username: yup
        .string()
        .required("اسم المستخدم مطلوب")
        .matches(/^[A-Za-z][A-Za-z0-9_]*$/, "اسم المستخدم يجب أن يبدأ بحرف ويحتوي فقط على أحرف وأرقام وشرطات سفلية")
        .min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل")
        .max(20, "اسم المستخدم يجب ألا يزيد عن 20 حرف"),
    fullName: yup
        .string()
        .required("الاسم بالكامل مطلوب")
        .matches(/^[\u0621-\u064A\u0660-\u0669A-Za-z\s]+$/, "الاسم بالكامل يجب أن يحتوي على أحرف عربية أو إنجليزية فقط")
        .min(5, "الاسم بالكامل يجب أن يكون 5 أحرف على الأقل")
        .max(50, "الاسم بالكامل يجب ألا يزيد عن 50 حرف"),
    email: yup.string().required("البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
    password: yup
        .string()
        .required("كلمة المرور مطلوبة")
        .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
        .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
        .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
        .matches(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
        .matches(/[^A-Za-z0-9]/, "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"),
    passwordConfirm: yup
        .string()
        .required("تأكيد كلمة المرور مطلوب")
        .oneOf([yup.ref("password")], "كلمتا المرور غير متطابقتين"),
});

export default function ShowAdmin() {
    const [admins, setAdmins] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset,
        setValue,
        clearErrors,
    } = useForm({
        resolver: yupResolver(showAddModal ? addSchema : editSchema),
    });

    const fetchAdmins = async () => {
        try {
            const res = await axiosInstance.get("/admins");
            setAdmins(res.data.data);
        } catch (err) {
            setAdmins([]);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "هل أنت متأكد؟",
            text: "لن تتمكن من استعادة هذا المسؤول!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم، احذف",
            cancelButtonText: "إلغاء",
        });
        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/admins/${id}`);
                fetchAdmins();
            } catch { }
        }
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setValue("username", admin.username);
        setValue("fullName", admin.fullName);
        setValue("email", admin.email);
        setValue("password", "");
        setShowEditModal(true);
    };

    const onSubmit = async (data) => {
        try {
            if (showAddModal) {
                await axiosInstance.post("/admins", data);
                setShowAddModal(false);
            } else {
                if (!data.password) delete data.password;
                await axiosInstance.patch(`/admins/${selectedAdmin._id}`, data);
                setShowEditModal(false);
            }
            reset();
            fetchAdmins();
        } catch (err) {
            if (err.response?.data?.errors) {
                err.response.data.errors.forEach((e) => {
                    setError(e.param, { type: "manual", message: e.msg });
                });
            }
        }
    };

    return (
        <div className={styles.container} dir="rtl">
            <h1 className={styles.mainHeader}>المسؤولون</h1>
            <button className={styles.btnAdd} onClick={() => setShowAddModal(true)}>
                <FaPlus className={styles.iconAdd} /> إضافة مسؤول
            </button>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>اسم المستخدم</th>
                        <th>الاسم الكامل</th>
                        <th>البريد الإلكتروني</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin) => (
                        <tr key={admin._id}>
                            <td>{admin.username}</td>
                            <td>{admin.fullName}</td>
                            <td>{admin.email}</td>
                            <td>
                                <button className={styles.btnEdit} onClick={() => handleEdit(admin)}>
                                    <FaEdit /> تعديل
                                </button>
                                <button className={styles.btnDelete} onClick={() => handleDelete(admin._id)}>
                                    <FaTrash /> حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {(showEditModal || showAddModal) && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>{showAddModal ? "إضافة مشرف جديد" : "تعديل بيانات المسؤول"}</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={styles.formGroup}>
                                <label>اسم المستخدم</label>
                                <input {...register("username")} className={styles.formInput} />
                                {errors.username && <div className={styles.error}>{errors.username.message}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>الاسم بالكامل</label>
                                <input {...register("fullName")} className={styles.formInput} />
                                {errors.fullName && <div className={styles.error}>{errors.fullName.message}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>البريد الإلكتروني</label>
                                <input {...register("email")} className={styles.formInput} />
                                {errors.email && <div className={styles.error}>{errors.email.message}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>كلمة المرور</label>
                                <input type="password" {...register("password")} className={styles.formInput} />
                                {errors.password && <div className={styles.error}>{errors.password.message}</div>}
                            </div>
                            {showAddModal && (
                                <div className={styles.formGroup}>
                                    <label>تأكيد كلمة المرور</label>
                                    <input type="password" {...register("passwordConfirm")} className={styles.formInput} />
                                    {errors.passwordConfirm && <div className={styles.error}>{errors.passwordConfirm.message}</div>}
                                </div>
                            )}
                            <div className={styles.modalActions}>
                                <button type="submit" disabled={isSubmitting} className={styles.btnSave}>
                                    حفظ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        reset();
                                        clearErrors();
                                    }}
                                    className={styles.btnCancel}
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