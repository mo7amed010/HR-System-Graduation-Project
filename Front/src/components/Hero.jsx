import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Hero = ({ onRequestQuote }) => {
  return (
    <section className="hero-section bg-gradient-hero text-white position-relative" id="hero">
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>
      
      <div className="container hero-content">
        <div className="row justify-content-center text-center mt-5 mb-5">
          <div className="col-lg-10">
            <h1 className="display-2 fw-bold mb-4 lh-base">
              نظام إدارة الموارد البشرية
              <span className="d-block text-warning mt-2">المتكامل</span>
            </h1>
            
            <p className="fs-4 text-light mb-5 lh-base fw-light">
              حلول متكاملة وذكية لإدارة الموظفين، الرواتب، الإجازات والمزيد. 
              صُمم خصيصاً لتبسيط عمليات إدارة الموارد البشرية في مؤسستك بكفاءة عالية.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              {[
                'إدارة شاملة للموظفين',
                'نظام رواتب متطور',
                'تتبع الإجازات',
                'تقارير تحليلية'
              ].map((feature, index) => (
                <div key={index} className="feature-badge">
                  <CheckCircle size={16} className="me-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button className="btn btn-custom-primary btn-lg" onClick={onRequestQuote}>
                <ArrowLeft size={20} className="ms-2" />
                اطلب عرضاً مخصصاً
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
