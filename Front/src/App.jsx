import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import AddEmployee from "./pages/AddEmployee/AddEmployee";
import WorkDetailes from "./pages/WorkDetailes/WorkDetailes";

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
            <Route path="/work" element={<WorkDetailes />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
