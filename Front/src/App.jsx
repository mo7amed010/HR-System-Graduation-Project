// import { BrowserRouter, Route, Routes } from 'react-router'
// import NotFound from './pages/NotFound'
// import Header from './components/Header'

// function App() {

//   return (
//     <>
//       <BrowserRouter>
//           <Header/>
//         <div className='container'>
//           <Routes>
//             {/* <Route path='' element={}/> */}
//             <Route path='*' element={<NotFound/>}/>
//           </Routes>
//         </div>
//       </BrowserRouter>
//     </>
//   )
// }

// export default App

import { BrowserRouter, Route, Routes } from 'react-router';
import { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// team code
// import Header from './components/Header';
// import NotFound from './pages/NotFound';

// fatma
import Navbar from './components/Navbar';
import ImageSlider from './components/ImageSlider';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleRequestQuote = () => {
    setIsQuoteModalOpen(true);
  };

  return (
    <BrowserRouter>
      {/* team code */}
      {/* <Header />  */}
      <div className=" min-vh-100 bg-white">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />

      
        <Routes>
           {/* <Route path='' element={}/> */} 
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
           {/* team code */}
          {/* <Route path="*" element={<NotFound />} />  */} 
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

