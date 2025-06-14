import { BrowserRouter, Route, Routes } from 'react-router'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import AddAdmin from './pages/AddAdmin'

function App() {

  return (
    <>
      <BrowserRouter>
          <Header/>
        <div className='container'>
          <Routes>
            <Route path='/add-admin' element={<AddAdmin/>}/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
