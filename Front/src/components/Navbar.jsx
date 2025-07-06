import React, { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn = false, onLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoggedIn) {
    return (
      <nav className="navbar navbar-expand-lg navbar-logged-in">
        <div className="container">
          <div className="navbar-brand">
            <img src="logo.png" alt="Logo" className="navbar-logo" />
          </div>
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button
                className="btn btn-outline-light d-flex align-items-center gap-2 rounded-pill"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div
                  className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "32px", height: "32px" }}
                >
                  <User size={16} className="text-dark" />
                </div>
                <span className="text-dark fw-semibold">
                  مسئول الموارد البشرية
                </span>
                <ChevronDown size={16} className="text-dark" />
              </button>

              {isDropdownOpen && (
                <div
                  className="dropdown-menu show mt-2"
                  style={{ right: 0, left: "auto" }}
                >
                  <div className="px-3 py-2 border-bottom">
                    <div className="fw-semibold">فاطمة</div>
                    <div className="text-muted">مسئول الموارد البشرية</div>
                  </div>
                  <button
                    className="dropdown-item text-end "
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (onLogout) onLogout();
                      navigate("/login");
                    }}
                  >
                    <LogOut size={16} className="me-2" />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        <a className="navbar-brand navbar-brand-custom" href="#">
          <img
            src="logo.png"
            alt="Pioneers Solutions Logo"
            className="navbar-logo"
          />
        </a>

        <button
          className="navbar-toggler custom-toggler border-0 "
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="text-dark" size={24} />
          ) : (
            <Menu className="text-dark" size={24} />
          )}
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button
                className="nav-link nav-link-custom btn btn-link p-0 text-decoration-none"
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document
                      .getElementById("slider")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                الصفحة الرئيسية
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link nav-link-custom btn btn-link p-0 text-decoration-none"
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document
                      .getElementById("hero")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                عن النظام
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link nav-link-custom btn btn-link p-0 text-decoration-none"
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                المميزات
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link nav-link-custom btn btn-link p-0 text-decoration-none"
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document
                      .getElementById("footer")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                اتصل بنا
              </button>
            </li>
          </ul>

          <button className="btn btn-login" onClick={() => navigate("/login")}>
            تسجيل الدخول
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
