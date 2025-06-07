import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from "react-helmet";
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Shipping from './pages/Shipping';
import Support from './pages/Support';
import Services from './pages/Services';
import About from './pages/About';
import AdminLogin from './components/Admin/AdminLogin';
import AdminPanel from './components/Admin/AdminPanel';
import Loader from './components/Loader/Loader';
import AnimatedShippingBackground from './components/AnimatedShippingBackground';
import CookieConsent from './components/CookieConsent/CookieConsent';
// Updated import paths for translation components
import GoogleTranslate from './components/translation/GoogleTranslate';
import LanguagePopup from './components/translation/LanguagePopup';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      window.history.replaceState(null, '', redirect);
    }
  }, []);

  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#161b22");
    } else {
      const meta = document.createElement('meta');
      meta.name = "theme-color";
      meta.content = "#161b22";
      document.head.appendChild(meta);
    }

    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <>
      <Helmet>
        <meta name="theme-color" content="#161b22" data-react-helmet="true" />
        <meta name="msapplication-navbutton-color" content="#161b22" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#161b22" />
      </Helmet>
      
      <div className="app">
        {/* Translation components placed at the root level */}
        <GoogleTranslate />
        <LanguagePopup />
        
        <AnimatedShippingBackground />
        <Router basename={process.env.PUBLIC_URL}>
          {loading && <Loader />}
          <Header isAdmin={isAdmin} />
          <main className="main-content">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/support" element={<Support />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route 
                path="/admin" 
                element={
                  isAdmin 
                    ? <AdminPanel onLogout={() => setIsAdmin(false)} /> 
                    : <AdminLogin onLogin={() => setIsAdmin(true)} />
                } 
              />
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
        </Router>
      </div>
    </>
  );
}

export default App;
