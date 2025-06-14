import { BrowserRouter, Route, Routes } from 'react-router'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Departments from "./pages/Departments";
import "bootstrap/dist/css/bootstrap.min.css";



function App() {

  return (
    <>
      <BrowserRouter>
          <Header/>
        <div className='container'>
          <Routes>
              <Route path="/departments" element={<Departments />} />

            {/* <Route path='' element={}/> */}
            {/* <Route path='*' element={<NotFound/>}/> */}
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
