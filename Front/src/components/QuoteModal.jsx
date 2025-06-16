import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Send } from 'lucide-react';
import Swal from 'sweetalert2';

const QuoteModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // simulation only for API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    Swal.fire({
      title: 'تم إرسال طلبك بنجاح!',
      text: 'سيتم التواصل معك خلال 24 ساعة',
      icon: 'success',
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#3498db'
    });

    setIsSubmitting(false);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">اطلب عرضاً مخصصاً</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">اسم الشركة *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                    {...register('companyName', { required: 'اسم الشركة مطلوب' })}
                  />
                  {errors.companyName && (
                    <div className="invalid-feedback">{errors.companyName.message}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">اسم المسؤول *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.contactName ? 'is-invalid' : ''}`}
                    {...register('contactName', { required: 'اسم المسؤول مطلوب' })}
                  />
                  {errors.contactName && (
                    <div className="invalid-feedback">{errors.contactName.message}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    {...register('email', {
                      required: 'البريد الإلكتروني مطلوب',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'البريد الإلكتروني غير صحيح'
                      }
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">رقم الهاتف *</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    {...register('phone', { required: 'رقم الهاتف مطلوب' })}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone.message}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label">عدد الموظفين *</label>
                  <select
                    className={`form-select ${errors.employeeCount ? 'is-invalid' : ''}`}
                    {...register('employeeCount', { required: 'عدد الموظفين مطلوب' })}
                  >
                    <option value="">اختر عدد الموظفين</option>
                    <option value="1-10">1-10 موظفين</option>
                    <option value="11-50">11-50 موظف</option>
                    <option value="51-100">51-100 موظف</option>
                    <option value="101-500">101-500 موظف</option>
                    <option value="500+">أكثر من 500 موظف</option>
                  </select>
                  {errors.employeeCount && (
                    <div className="invalid-feedback">{errors.employeeCount.message}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label">المتطلبات الخاصة</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="اذكر أي متطلبات خاصة أو ملاحظات..."
                    {...register('requirements')}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary flex-fill"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="me-2" />
                      إرسال الطلب
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
