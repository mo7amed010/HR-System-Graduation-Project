import React, { useState } from "react";
import { Users, Calendar, FileText, Clock, UserPlus, Settings } from "lucide-react";

import HolidaysPage from "../pages/officialholidaysPage";
import ShowEmployee from "../pages/ShowEmployee/ShowEmployee";
import ShowAdmin from "../pages/ShowAdmin/ShowAdmin";
import { FaPlaneDeparture } from "react-icons/fa";
import Departments from "../pages/Departments";
import EmployeeDetails from "../pages/AddEmployee/EmployeeDetails/EmployeeDetails";
import Setting from "../pages/Setting/Setting";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  const tabs = [
    { id: "attendance", label: "نظام الحضور والانصراف", icon: Clock },
    { id: "leaves", label: "الإجازات الرسمية", icon: Calendar },
    { id: "payroll", label: "تقارير الرواتب", icon: FileText },
    { id: "employees", label: "إدارة الموظفين", icon: Users },
    { id: "admins", label: "المسؤول", icon: Users },
    { id: "addEmployee", label: "إضافة موظف", icon: UserPlus },

    { id: "setting", label: "الاعدادت العامه ", icon: Settings },
    { id: "departments", label: "الأقسام", icon: FaPlaneDeparture },
  ];

  const contentMap = {
    attendance: { title: "نظام الحضور والانصراف" },
    leaves: { title: "الإجازات الرسمية" },
    payroll: { title: "تقارير الرواتب" },
    employees: { title: "إدارة الموظفين" },
    "add-user": {
      title: "إضافة مستخدم جديد",
      description: "إضافة موظفين جدد وتعيين الصلاحيات المناسبة",
    },
    departments: { title: "إدارة الأقسام" },
  };


  // const renderTabContent = () => {
  //   const content = contentMap[activeTab];

  //   return (
  //     <div className="card tab-content-card">
  //       <div className="card-header card-header-custom">
  //         <h4 className="mb-0 text-primary">
  //           {(() => {
  //             const current = tabs.find((tab) => tab.id === activeTab);
  //             return current
  //               ? React.createElement(current.icon, {
  //                   size: 24,
  //                   className: "me-2",
  //                 })
  //               : null;
  //           })()}
  //           {content.title}
  //         </h4>
  //       </div>
  //       <div className="card-body card-body-custom">
  //         <div className="row">
  //           <div className="col-md-4">
  //             <div className="alert alert-custom bg-light">
  //               <h6 className="alert-heading">
  //                 <Clock size={20} className="me-2" />
  //                 حالة التطوير
  //               </h6>
  //               <p className="mb-0">
  //                 <strong>قريباً:</strong> سيتم إضافة المزيد من الميزات المتقدمة
  //                 لهذا القسم
  //               </p>
  //               <hr />
  //               <small className="text-muted">
  //                 نعمل باستمرار على تحسين وتطوير النظام لخدمتكم بشكل أفضل
  //               </small>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  const handleAddAdmin = () => {
    setActiveTab("add-user");
  };

  const handleEditAdmin = (id) => {
    setEditEmployeeId(id); // يمكن إعادة تسمية هذه الحالة إلى setEditAdminId لتجنب الالتباس
    setActiveTab("add-user");
  };



  const handleAddEmployee = () => {
    setEditEmployeeId(null);
    setActiveTab("addEmployee");
  };

  const handleEditEmployee = (id) => {
    setEditEmployeeId(id);
    setActiveTab("addEmployee");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "leaves":
        return <HolidaysPage />;
      case "employees":
        return (
          <ShowEmployee
            onAddEmployeeClick={handleAddEmployee}
            onEditEmployee={handleEditEmployee}
          />
        );
      case "admins":
        return (
          <ShowAdmin
            onAddAdminClick={handleAddAdmin}
            onEditAdmin={handleEditAdmin}
          />
        );
     
      case "departments":
        return <Departments />;
      case "addEmployee":
        return (
          <EmployeeDetails
            employeeId={editEmployeeId}
            onSaveSuccess={() => setActiveTab("employees")}
          />
        );
      case "setting":
        return <Setting />;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-4" dir="rtl">
      <div className="row">
        <div className="col-12">
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs nav-tabs-custom" role="tablist">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  role="tab"
                >
                  <tab.icon size={18} className="me-2" />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab Content */}
          <div className="tab-content mt-0">
            <div className="tab-pane fade show active">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
