import React from 'react';
import { Users, DollarSign, Calendar, BarChart3, Shield, Clock, FileText, Settings } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Users,
      title: 'إدارة الموظفين',
      description: 'نظام متكامل لإدارة بيانات الموظفين، تتبع سجلهم الوظيفي، وتقييم أدائهم بسهولة وكفاءة عالية.',
      color: 'linear-gradient(135deg, #3498db, #2980b9)'
    },
    {
      icon: DollarSign,
      title: 'نظام الرواتب',
      description: 'حساب الرواتب والأجور تلقائياً مع دعم كافة الاستقطاعات والإضافات وفقاً للوائح المؤسسة.',
      color: 'linear-gradient(135deg, #27ae60, #229954)'
    },
    {
      icon: Calendar,
      title: 'إدارة الإجازات',
      description: 'تتبع طلبات الإجازات، الموافقة عليها أو رفضها، وحساب الرصيد المتبقي لكل موظف بدقة.',
      color: 'linear-gradient(135deg, #9b59b6, #8e44ad)'
    },
    {
      icon: BarChart3,
      title: 'التقارير التحليلية',
      description: 'تقارير شاملة ومفصلة مع رسوم بيانية تفاعلية لمساعدتك في اتخاذ القرارات الصحيحة.',
      color: 'linear-gradient(135deg, #e67e22, #d35400)'
    },
    {
      icon: Shield,
      title: 'الأمان والحماية',
      description: 'نظام أمان متقدم مع تشفير البيانات وصلاحيات مختلفة لضمان حماية المعلومات الحساسة.',
      color: 'linear-gradient(135deg, #e74c3c, #c0392b)'
    },
    {
      icon: Clock,
      title: 'تتبع الوقت',
      description: 'نظام حضور وانصراف متطور مع تتبع ساعات العمل والوقت الإضافي بدقة عالية.',
      color: 'linear-gradient(135deg, #6c5ce7, #5f3dc4)'
    },
    {
      icon: FileText,
      title: 'إدارة الوثائق',
      description: 'تنظيم وأرشفة جميع الوثائق والملفات المتعلقة بالموظفين مع إمكانية البحث السريع.',
      color: 'linear-gradient(135deg, #00b894, #00a085)'
    },
    {
      icon: Settings,
      title: 'قابلية التخصيص',
      description: 'نظام مرن قابل للتخصيص حسب احتياجات مؤسستك مع واجهات سهلة الاستخدام.',
      color: 'linear-gradient(135deg, #636e72, #2d3436)'
    }
  ];

  return (
    <section className="py-5 bg-light" id="features">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-4 fw-bold text-dark mb-4">
              المميزات الرئيسية
            </h2>
            <p className="fs-5 text-muted mx-auto" style={{ maxWidth: '600px' }}>
              اكتشف مجموعة شاملة من الأدوات والمميزات المصممة لتحسين كفاءة إدارة الموارد البشرية في مؤسستك
            </p>
          </div>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="card h-100 card-hover border-0">
                <div className="card-body p-4">
                  <div 
                    className="feature-icon mb-3"
                    style={{ 
                      background: feature.color, 
                      borderRadius: '12px', 
                      width: '48px', 
                      height: '48px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <feature.icon size={28} color="white" />
                  </div>
                  <h5 className="card-title fw-bold text-dark mb-3">
                    {feature.title}
                  </h5>
                  <p className="card-text text-muted lh-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
