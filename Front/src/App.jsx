import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import AddEmployee from "./pages/AddEmployee/EmployeeDetails/EmployeeDetails";
import ShowEmployee from "./pages/ShowEmployee/ShowEmployee";
import Setting from "./pages/Setting/Setting";


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="container">
          <Routes>
            {/* <Route path='' element={}/> */}
            <Route path="*" element={<NotFound />} />
            <Route path="/add" element={<AddEmployee />} />
            <Route path="/add/:id" element={<AddEmployee />} />
            <Route path="/show" element={<ShowEmployee />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
