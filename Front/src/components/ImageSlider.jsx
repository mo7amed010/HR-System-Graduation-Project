import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'إدارة شاملة للموظفين',
      subtitle: 'نظام متكامل لإدارة جميع بيانات الموظفين والملفات الشخصية'
    },
    {
      image: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'نظام رواتب متطور',
      subtitle: 'حساب الرواتب والمستحقات بدقة عالية ووفقاً للوائح المؤسسية'
    },
    {
      image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'تقارير تحليلية متقدمة',
      subtitle: 'تقارير شاملة ومفصلة لمساعدتك في اتخاذ القرارات الصحيحة'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="container slider-container" id="slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="slider-slide"
          style={{
            transform: `translateX(${(index - currentSlide) * 100}%)`,
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
          <div className="slider-overlay">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                  <h2 className="display-4 fw-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="fs-4 animate-fade-in animation-delay-300">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={prevSlide} className="slider-nav prev">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="slider-nav next">
        <ChevronRight size={24} />
      </button>

      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
