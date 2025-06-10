import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import LanguagePopup from './components/LanguagePopup';
import { applySavedLanguage } from './services/translationService';
import './components/translation.css';
import './App.css';

// Enhanced route translation handler
function RouteTranslator() {
  const location = useLocation();
  const prevPathRef = useRef('');
  const translationPendingRef = useRef(false);
  const translationTimerRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    
    // Skip initial render
    if (prevPathRef.current === '') {
      prevPathRef.current = location.pathname;
      return;
    }

    // Clear any pending translation
    if (translationTimerRef.current) {
      clearTimeout(translationTimerRef.current);
    }

    // Skip if translation is already pending
    if (translationPendingRef.current) return;

    translationPendingRef.current = true;

    const translateCurrentPage = async () => {
      try {
        // Wait for React to update the DOM
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Apply translation
        await applySavedLanguage(savedLang);
      } catch (error) {
        console.error('Navigation translation error:', error);
      } finally {
        translationPendingRef.current = false;
      }
    };

    // Start translation after a short delay to ensure DOM is ready
    translationTimerRef.current = setTimeout(translateCurrentPage, 100);
    
    prevPathRef.current = location.pathname;

    return () => {
      if (translationTimerRef.current) {
        clearTimeout(translationTimerRef.current);
      }
    };
  }, [location]);

  return null;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialLangApplied = useRef(false);

  useEffect(() => {
    // Apply saved language on initial load
    if (!initialLangApplied.current) {
      const savedLang = localStorage.getItem('selectedLanguage') || 'en';
      if (savedLang && savedLang !== 'en') {
        applySavedLanguage(savedLang);
      }
      initialLangApplied.current = true;
    }

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
        <LanguagePopup />
        <AnimatedShippingBackground />
        <Router basename={process.env.PUBLIC_URL}>
          <RouteTranslator />
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
