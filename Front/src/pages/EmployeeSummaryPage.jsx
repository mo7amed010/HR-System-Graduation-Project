import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../apis/config";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import {
  FaUser,
  FaBuilding,
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaLeaf,
  FaChartBar,
  FaSearch,
  FaArrowLeft,
  FaEye,
} from "react-icons/fa";
import Swal from "sweetalert2";

function toArabicNumber(num) {
  return num?.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]) ?? "";
}

const EmployeeSummaryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [loading, setLoading] = useState(false);
  const [showEmployeeSelector, setShowEmployeeSelector] = useState(false);
  const [reportUnavailable, setReportUnavailable] = useState(false);
  const [unavailableMessage, setUnavailableMessage] = useState("");

  const arabicMonths = [
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
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i); // 3 سنوات سابقة و3 لاحقة

  // Fetch employees for dropdown
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch summary when employee ID or month changes
  useEffect(() => {
    if (id) {
      fetchSummary(id, selectedMonth);
    }
  }, [id, selectedMonth]);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/employees/summary/list");
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      Swal.fire("Error", "Failed to fetch employees", "error");
    }
  };

  const fetchSummary = async (employeeId, month, preview = false) => {
    setLoading(true);
    setReportUnavailable(false);
    setUnavailableMessage("");

    try {
      const [year, monthOnly] = month.split("-");
      let url = `/employees/${employeeId}/summary?month=${monthOnly}&year=${year}`;

      if (preview) {
        url += "&preview=true";
      }

      const response = await axiosInstance.get(url);

      // Check if this is a "report unavailable" response
      if (
        response.data.message &&
        response.data.partialReportAvailable === false
      ) {
        setReportUnavailable(true);
        setUnavailableMessage(response.data.message);
        setSummary(null);
      } else {
        setSummary(response.data.data);
        setReportUnavailable(false);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      Swal.fire("Error", "Failed to fetch employee summary", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId);
    if (employeeId) {
      navigate(`/summary/${employeeId}`);
    }
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handlePreviewClick = () => {
    fetchSummary(id, selectedMonth, true);
  };

  const isCurrentMonth = () => {
    return selectedMonth === dayjs().format("YYYY-MM");
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 95) return "success";
    if (percentage >= 90) return "info";
    if (percentage >= 80) return "warning";
    return "danger";
  };

  const getPerformanceText = (percentage) => {
    if (percentage >= 95) return "ممتاز";
    if (percentage >= 90) return "جيد جداً";
    if (percentage >= 80) return "جيد";
    if (percentage >= 70) return "مقبول";
    return "ضعيف";
  };

  // أضف هذا الستايل داخل JSX أو في ملف CSS خارجي
  const statCardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 8px #0001",
    padding: "24px 0 12px 0",
    textAlign: "center",
    marginBottom: "16px",
    transition: "box-shadow 0.2s",
  };
  const statCircleStyle = {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #3498db 60%, #2c3e50 100%)",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    margin: "0 auto 8px auto",
    boxShadow: "0 2px 8px #3498db33",
  };
  const summaryCardStyle = {
    background: "#e0f7fa",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    fontSize: "1.2rem",
    color: "#065a60",
    boxShadow: "0 2px 8px #0001",
  };
  const headerBarStyle = {
    background: "linear-gradient(90deg, #3498db 60%, #2c3e50 100%)",
    color: "#fff",
    padding: "18px 0",
    borderRadius: "0 0 24px 24px",
    marginBottom: "32px",
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    letterSpacing: "1px",
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Generating employee summary...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ direction: "rtl" }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="ms-2" />
              رجوع
            </button>
            <h2 className="text-center mb-0" style={{ color: "#069ED3" }}>
              تقرير ملخص الموظف
            </h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowEmployeeSelector(!showEmployeeSelector)}
            >
              <FaSearch className="ms-2" />
              تغيير الموظف
            </button>
          </div>
        </div>
      </div>

      {/* Employee Selector */}
      {showEmployeeSelector && (
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <FaUser className="me-2" />
                  اختر موظف
                </h5>
                <select
                  className="form-select mb-3"
                  value={selectedEmployee}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                >
                  <option value="">اختر موظف...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <FaCalendarAlt className="ms-2" />
                  اختر الشهر
                </h5>
                <div className="d-flex gap-2">
                  <select
                    className="form-select"
                    value={selectedMonth.split("-")[1]}
                    onChange={(e) => {
                      const year = selectedMonth.split("-")[0];
                      setSelectedMonth(
                        `${year}-${e.target.value.padStart(2, "0")}`
                      );
                    }}
                  >
                    {arabicMonths.map((name, idx) => (
                      <option
                        key={idx}
                        value={String(idx + 1).padStart(2, "0")}
                      >
                        {name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select"
                    value={selectedMonth.split("-")[0]}
                    onChange={(e) => {
                      const month = selectedMonth.split("-")[1];
                      setSelectedMonth(`${e.target.value}-${month}`);
                    }}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {toArabicNumber(y)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Unavailable Message */}
      {reportUnavailable && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning text-center" role="alert">
              <h5 className="alert-heading">
                <FaExclamationTriangle className="me-2" />
                التقرير غير متاح حاليًا
              </h5>
              <p className="mb-3">{unavailableMessage}</p>
              {isCurrentMonth() && (
                <button
                  className="btn btn-primary"
                  onClick={handlePreviewClick}
                >
                  <FaEye className="me-2" />
                  عرض تقرير مبدئي
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {summary ? (
        <>
          {/* Partial Report Indicator */}
          {summary.partialReportAvailable && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="alert alert-info text-center" role="alert">
                  <h6 className="mb-0">
                    <FaEye className="me-2" />
                    هذا تقرير مبدئي للشهر الحالي
                  </h6>
                </div>
              </div>
            </div>
          )}

          {/* Employee Info Card */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h3 className="card-title mb-2">
                        <FaUser className="me-2 text-primary" />
                        {summary.employee.name}
                      </h3>
                      <p className="text-muted mb-1">
                        <FaBuilding className="me-2" />
                        القسم: {summary.employee.department}
                      </p>
                      <p className="text-muted mb-0">
                        <FaBriefcase className="me-2" />
                        المنصب: {summary.employee.jobTitle}
                      </p>
                    </div>
                    <div className="col-md-4 text-end">
                      <div
                        className={`badge bg-${getPerformanceColor(
                          summary.stats.attendance.attendancePercentage
                        )} fs-6 p-3`}
                      >
                        {getPerformanceText(
                          summary.stats.attendance.attendancePercentage
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div
                style={statCardStyle}
                className="stat-card card-hover animate-fade-in"
              >
                <div style={statCircleStyle}>
                  <FaCheckCircle />
                </div>
                <div className="fs-3 fw-bold">
                  {toArabicNumber(summary.stats.attendance.presentDays)}
                </div>
                <div className="text-muted">أيام الحضور</div>
              </div>
            </div>
            <div className="col-md-3">
              <div
                style={statCardStyle}
                className="stat-card card-hover animate-fade-in animation-delay-300"
              >
                <div
                  style={{
                    ...statCircleStyle,
                    background:
                      "linear-gradient(135deg, #e74c3c 60%, #c0392b 100%)",
                  }}
                >
                  <FaTimesCircle />
                </div>
                <div className="fs-3 fw-bold">
                  {toArabicNumber(summary.stats.attendance.absentDays)}
                </div>
                <div className="text-muted">أيام الغياب</div>
              </div>
            </div>
            <div className="col-md-3">
              <div
                style={statCardStyle}
                className="stat-card card-hover animate-fade-in animation-delay-300"
              >
                <div
                  style={{
                    ...statCircleStyle,
                    background:
                      "linear-gradient(135deg, #f1c40f 60%, #f39c12 100%)",
                  }}
                >
                  <FaClock />
                </div>
                <div className="fs-3 fw-bold">
                  {toArabicNumber(summary.stats.attendance.lateDays)}
                </div>
                <div className="text-muted">أيام التأخير</div>
              </div>
            </div>
            <div className="col-md-3">
              <div
                style={statCardStyle}
                className="stat-card card-hover animate-fade-in animation-delay-300"
              >
                <div
                  style={{
                    ...statCircleStyle,
                    background:
                      "linear-gradient(135deg, #16a085 60%, #27ae60 100%)",
                  }}
                >
                  <FaChartBar />
                </div>
                <div className="fs-3 fw-bold">
                  {toArabicNumber(
                    summary.stats.attendance.totalOvertimeMinutes
                  )}
                </div>
                <div className="text-muted">دقائق العمل الإضافي</div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="row mb-4">
            <div className="col-md-12 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <FaChartBar className="me-2" />
                    إحصائيات الحضور
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <p className="mb-1">
                        <strong>نسبة الحضور:</strong>
                      </p>
                      <span
                        className={`badge bg-${getPerformanceColor(
                          summary.stats.attendance.attendancePercentage
                        )}`}
                      >
                        {toArabicNumber(
                          summary.stats.attendance.attendancePercentage
                        )}
                        %
                      </span>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-1">
                        <strong>إجمالي الأيام:</strong>
                      </p>
                      <span className="text-muted">
                        {toArabicNumber(summary.stats.attendance.totalDays)} يوم
                      </span>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-1">
                        <strong>إجمالي التأخير:</strong>
                      </p>
                      <span className="text-muted">
                        {toArabicNumber(
                          summary.stats.attendance.totalLateMinutes
                        )}{" "}
                        دقيقة
                      </span>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-1">
                        <strong>إجمالي العمل الإضافي:</strong>
                      </p>
                      <span className="text-muted">
                        {toArabicNumber(
                          summary.stats.attendance.totalOvertimeMinutes
                        )}{" "}
                        دقيقة
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div
            style={summaryCardStyle}
            className="summary-card animate-fade-in"
          >
            <FaChartBar className="me-2" />
            <span style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
              الملخص الذكي:
            </span>
            <div className="mt-2">{summary.summary}</div>
          </div>
          <div className="p-2"></div>
        </>
      ) : (
        <div className="text-center mt-5">
          <FaUser size={64} className="text-muted mb-3" />
          <h4 className="text-muted">اختر موظف لعرض الملخص</h4>
          <p className="text-muted">
            استخدم زر "تغيير الموظف" أعلاه لاختيار موظف
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeSummaryPage;
