import { BrowserRouter, Route, Routes } from 'react-router'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Login from './pages/Login'

function App() {

  return (
    <>
      <BrowserRouter>
          <Header/>
        <div className='container'>
          <Routes>
            {/* <Route path='' element={}/> */}
            <Route path='login' element={<Login/>}/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
