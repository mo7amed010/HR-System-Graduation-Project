import { BrowserRouter, Route, Routes } from 'react-router';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Attendance from "./pages/Attendance"; 

import Departments from "./pages/Departments";
import AddEmployee from "./pages/AddEmployee/EmployeeDetails/EmployeeDetails";
import ShowEmployee from "./pages/ShowEmployee/ShowEmployee";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className='container'>
          <Routes>
            <Route path="/attendance" element={<Attendance />} /> 
            <Route path="/add" element={<AddEmployee />} />
            <Route path="/show" element={<ShowEmployee />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
