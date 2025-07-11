import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ImageSlider from "./components/ImageSlider";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import QuoteModal from "./components/QuoteModal";
import Dashboard from "./components/Dashboard";
import AddEmployee from "./pages/AddEmployee/EmployeeDetails/EmployeeDetails";
import ShowEmployee from "./pages/ShowEmployee/ShowEmployee";
import Setting from "./pages/Setting/Setting";
import EmployeeSummaryPage from "./pages/EmployeeSummaryPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleRequestQuote = () => {
    setIsQuoteModalOpen(true);
  };

  return (
    <BrowserRouter>
      <div className=" min-vh-100 bg-white">
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        <Routes>
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <>
                  <section className="my-5">
                    <ImageSlider />
                  </section>
                  <Hero onRequestQuote={handleRequestQuote} />
                  <Features />
                </>
              ) : (
                <Dashboard />
              )
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/add/:id" element={<AddEmployee />} />
          <Route path="/show" element={<ShowEmployee />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/summary/:id" element={<EmployeeSummaryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </BrowserRouter>
  );
}

export default App;
