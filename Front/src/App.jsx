import { BrowserRouter, Route, Routes } from 'react-router'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import HolidaysPage from './pages/officialholidays/officialholidaysPage';

function App() {

  return (
    <>
      <BrowserRouter>
          <Header/>
        <div className='container'>
          <Routes>
            <Route path="/holidays" element={<HolidaysPage />} />
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
