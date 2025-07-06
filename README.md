# 💼 HR Management System

نظام متكامل لإدارة الموارد البشرية (HR) يتضمن:
- تسجيل الموظفين
- الحضور والانصراف
- حساب المرتبات
- تتبع التأخيرات والإضافي
- إدارة الإجازات الرسمية
- واجهة تفاعلية مع Chatbot للحصول على تقارير فورية

---

## ⚙️ التقنيات المستخدمة

### 🧠 Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- RESTful APIs
- Day.js for date handling

### 🎨 Frontend
- React.js
- Axios
- Bootstrap + CSS
- React Icons
- Chatbot component

---

## 🗂️ بنية المشروع

HR-System/
├── Back/ # مجلد الباك إند
│ ├── Controllers/ # منطق الأعمال
│ ├── Models/ # Schemas لـ Mongoose
│ ├── Routers/ # تعريف API Routes
│ ├── Utils/ # أدوات مساعدة مثل CatchAsync
│ └── app.js # ملف تشغيل السيرفر
├── Front/ # الواجهة الأمامية React
│ ├── components/ # مكونات مثل ChatBot
│ ├── pages/ # الشاشات الأساسية (موظفين - إعدادات - رواتب..)
│ ├── apis/config.js # إعداد Axios instance
│ └── App.jsx # نقطة بداية التطبيق
