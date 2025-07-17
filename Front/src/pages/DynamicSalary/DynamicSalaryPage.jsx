import React, { useEffect, useState } from "react";
import axiosInstance from "../../apis/config";
import Swal from "sweetalert2";
import "./DynamicSalaryPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const DynamicSalaryPage = () => {
  const [data, setData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
  );
  const [searchName, setSearchName] = useState("");

  const fetchSalaries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get(
        `dynamicSalary?year=${selectedYear}&month=${selectedMonth}&name=${searchName}`
      );
      setData(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        Swal.fire({
          icon: "warning",
          title: "تنبيه",
          text: err.response.data.message,
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#0ea5e9",
        }).then(() => {
          setSearchName("");

          setSelectedYear(new Date().getFullYear());
          setSelectedMonth(
            (new Date().getMonth() + 1).toString().padStart(2, "0")
          );
          setError(null);
        });
      } else {
        setError("فشل الاتصال بالخادم. حاول مرة أخرى.");
        Swal.fire({
          icon: "error",
          title: "حدث خطأ",
          text: "فشل الاتصال بالخادم. حاول مرة أخرى.",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#e11d48",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [selectedYear, selectedMonth]);

  if (isLoading)
    return <p className="text-center my-5">جاري تحميل البيانات...</p>;
  if (error) return null;
  if (!data) return null;

  const totalEmployees = data.employeesPayroll.length;
  const totalNetSalary = data.employeesPayroll
    .reduce((total, emp) => total + parseFloat(emp.netSalary), 0)
    .toFixed(2);
  const currentMonth = new Date().toLocaleString("ar-EG", { month: "long" });

  const monthOptions = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  return (
    <div className="container py-4">
      <h3 className="mb-2 text-center" style={{ color: "#003366" }}>
        <i className="bi bi-people-fill me-2 fs-4"></i> نظام إدارة رواتب
        الموظفين
      </h3>
      <p className="mb-4 text-center" style={{ color: "#004080" }}>
        إدارة شاملة لرواتب ومستحقات الموظفين
      </p>

      <div className="summary-cards">
        <div className="summary-card employees">
          <i
            className="bi bi-people-fill"
            style={{ fontSize: 28, marginBottom: 8 }}
          ></i>
          <div>إجمالي الموظفين</div>
          <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {totalEmployees.toLocaleString("ar-EG")}
          </div>
        </div>
        <div className="summary-card salary">
          <i
            className="bi bi-cash-stack"
            style={{ fontSize: 28, marginBottom: 8 }}
          ></i>
          <div>إجمالي الرواتب</div>
          <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {totalNetSalary.toLocaleString("ar-EG")} جنيه
          </div>
        </div>
        <div className="summary-card month">
          <i
            className="bi bi-calendar2-week"
            style={{ fontSize: 28, marginBottom: 8 }}
          ></i>
          <div>الشهر الحالي</div>
          <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {currentMonth}
          </div>
        </div>
      </div>

      <div className="search-bar-container mb-3">
        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            fetchSalaries();
          }}
        >
          <input
            type="text"
            placeholder="بحث عن موظف..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            className="form-select text-end"
            style={{ direction: "rtl", paddingRight: "2rem" }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year.toLocaleString("ar-EG", { useGrouping: false })}
                </option>
              );
            })}
          </select>

          <select
            className="form-select text-end"
            style={{ direction: "rtl", paddingRight: "2rem" }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthOptions.map((month, index) => (
              <option
                key={index}
                value={(index + 1).toString().padStart(2, "0")}
              >
                {month}
              </option>
            ))}
          </select>

          <button
            className="btn d-flex align-items-center"
            style={{ backgroundColor: "#0ea5e9", color: "#fff" }}
          >
            <i className="bi bi-search ms-1"></i> بحث
          </button>
        </form>
      </div>

      <div className="salary-table table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th>اسم الموظف</th>
              <th>الفترة</th>
              <th>أيام الشهر</th>
              <th>أيام الحضور</th>
              <th>الراتب الأساسي</th>
              <th>الإضافي</th>
              <th>الخصومات</th>
              <th>الصافي</th>
            </tr>
          </thead>
          <tbody>
            {data.employeesPayroll.map((item, index) => (
              <tr key={index}>
                <td>
                  <i
                    className="bi bi-person-circle"
                    style={{ marginLeft: 6, color: "#0ea5e9" }}
                  ></i>
                  {item.employee.name}
                </td>
                <td>{item.period}</td>
                <td>{item.workingDays}</td>
                <td>{item.attendedDays}</td>
                <td>{item.baseSalary}</td>
                <td>{item.totalAdditions}</td>
                <td>{item.totalDeductions}</td>
                <td className="text-success">{item.netSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicSalaryPage;
