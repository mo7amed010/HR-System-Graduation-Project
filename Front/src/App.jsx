import { BrowserRouter, Route, Routes } from 'react-router'
import NotFound from './pages/NotFound'
import Header from './components/Header'

function App() {

  return (
    <>
      <BrowserRouter>
          <Header/>
        <div className='container'>
          <Routes>
            {/* <Route path='' element={}/> */}
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
