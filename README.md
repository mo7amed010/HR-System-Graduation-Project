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

<pre lang="markdown"> ## 🗂️ بنية المشروع ```txt HR-System/ Back/ # الباك إند (Node.js + Express) Controllers/ # ملفات التحكم والمنطق attendance.controller.js chatbot.controller.js payroll.controller.js Models/ # نماذج Mongoose (MongoDB) employee.js attendance.js salaryAdjustments.js weeklyHolidays.js officialHolidays.js Routers/ # تعريف المسارات (Routes) attendance.routes.js chatbot.routes.js payroll.routes.js Validation/ # التحقق من البيانات (Joi) attendance.validation.js Utils/ # أدوات مساعدة (مثل CatchAsync) CatchAsync.js app.js # تشغيل السيرفر Front/ # الواجهة الأمامية (React) components/ # مكونات مستقلة مثل ChatBot ChatBot.jsx ChatBot.css pages/ # صفحات النظام (الموظفين - الحضور - الرواتب) AddEmployee/ Attendance.jsx DynamicSalaryPage.jsx HolidaysPage.jsx apis/ # إعداد axios config.js App.jsx # نقطة انطلاق React index.js README.md # ملف التوثيق ``` </pre>
