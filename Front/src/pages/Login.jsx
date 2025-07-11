import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axiosInstance from '../apis/config'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login({ onLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/login', data); // عدّل حسب الـ endpoint
      console.log(response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (onLogin) onLogin();
        Swal.fire({
          icon: 'success',
          title: 'تم تسجيل الدخول بنجاح',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'فشل تسجيل الدخول',
          text: 'لم يتم العثور على التوكن',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في تسجيل الدخول',
        text: error?.response?.data?.message || 'تأكد من البريد وكلمة المرور',
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow w-100 py-5" style={{ maxWidth: '500px' }} >
        <div className='text-center mb-4'><img src="logo.png" className='img-fluid' alt="log" /></div>
        <h2 className='text-center mb-3'> مرحبا بك في</h2>
        <p className='text-center mb-4'>نظام إدارة الموارد البشرية</p>

        <form onSubmit={handleSubmit(onSubmit)} className='py-1 '>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">البريد الإلكتروني:</label>
            <input
              type="email"
              {...register('email', { required: 'البريد الإلكتروني مطلوب', pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "صيغة البريد الإلكتروني غير صحيحة"
    } })}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              placeholder='ادخل البريد الإلكتروني'
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">كلمة المرور:</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'كلمة المرور مطلوبة',
                  minLength: { value: 8, message: 'يجب أن تكون 8 أحرف على الأقل' }
                })}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                placeholder='ادخل كلمة المرور'
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className='btn btn-primary w-100 mt-2'>تسجيل الدخول</button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;
