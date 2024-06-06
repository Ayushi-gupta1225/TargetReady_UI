// import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
// import ContactUs from './pages/ContactUs';
// import AboutUs from './pages/AboutUs';

const App = () => {
  return (
    <Router>
      <div>
        <nav className="bg-[#CC0000] p-4">
          <ul className="flex justify-between items-center">
            <li><Link className="text-white text-lg font-bold" to="/">Planogram</Link></li>
            <div className="flex space-x-4">
              {/* <li><Link className="text-white text-lg" to="/contact-us">Contact Us</Link></li>
              <li><Link className="text-white text-lg" to="/about-us">About Us</Link></li> */}
            </div>
          </ul>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
