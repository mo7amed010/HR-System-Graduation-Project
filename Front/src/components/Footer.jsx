import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white" id="footer">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <img src="logo.png" alt="Pioneers Solutions Logo" style={{ height: '50px' }} className="navbar-logo" />
            </div>
            <p className="text-light lh-base mb-4">
              نحن نقدم حلول تقنية متطورة لإدارة الموارد البشرية 
              بطريقة الحديثة والمتطورة، مما يساعد المؤسسات على 
              تحسين كفاءة العمل وإدارة الموظفين بفعالية
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-secondary"><Facebook size={20} /></a>
              <a href="#" className="text-secondary"><Twitter size={20} /></a>
              <a href="#" className="text-secondary"><Linkedin size={20} /></a>
              <a href="#" className="text-secondary"><Instagram size={20} /></a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="text-primary mb-4 me-5">خدماتنا</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">نظام الحضور والانصراف</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">إدارة الموظفين</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">تقارير الرواتب</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">الإجازات الرسمية</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">الدعم الفني</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="text-primary mb-4 me-5">روابط سريعة</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">الصفحة الرئيسية</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">حول الشركة</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">خدماتنا</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">اتصل بنا</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="text-primary mb-4 me-4">تواصل معنا</h5>
            <div className="d-flex align-items-center mb-3">
              <Phone size={20} className="text-primary me-3" />
              <span className="text-light">5678 1234 10 20+</span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Mail size={20} className="text-primary me-3" />
              <span className="text-light">info@pioneers-solutions.com</span>
            </div>
            <div className="d-flex align-items-center">
              <MapPin size={20} className="text-primary me-3" />
              <span className="text-light">القاهرة - جمهورية مصر العربية</span>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="d-flex gap-4 mb-3 mb-md-0">
              <a href="#" className="text-secondary text-decoration-none small">الدعم الفني</a>
              <a href="#" className="text-secondary text-decoration-none small">شروط الاستخدام</a>
              <a href="#" className="text-secondary text-decoration-none small">سياسة الخصوصية</a>
            </div>
          </div>
          <div className="col-md-6 text-md-start text-start">
            <p className="text-secondary small mb-0">
              جميع الحقوق محفوظة -@ Pioneers Solutions 2024. 
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
