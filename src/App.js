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
import { applySavedLanguage, setupTranslationObserver } from './services/translationService';
import './components/translation.css';
import './App.css';

// New robust route translation handler
function RouteTranslationHandler() {
  const location = useLocation();
  const initialRender = useRef(true);
  const observerRef = useRef(null);
  const retryTimerRef = useRef(null);
  const attemptRef = useRef(0);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    
    // Skip initial render
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Cleanup previous attempts
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Main translation function with retry logic
    const attemptTranslation = async () => {
      try {
        await applySavedLanguage(savedLang);
      } catch (error) {
        console.error('Translation attempt failed:', error);
        
        // Setup observer if first attempt fails
        if (attemptRef.current === 0) {
          observerRef.current = setupTranslationObserver(savedLang);
        }
        
        // Retry up to 3 times
        if (attemptRef.current < 3) {
          attemptRef.current++;
          retryTimerRef.current = setTimeout(attemptTranslation, 300 * attemptRef.current);
        } else {
          attemptRef.current = 0;
        }
      }
    };

    // Reset attempt counter
    attemptRef.current = 0;
    
    // First translation attempt
    attemptTranslation();
    
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (observerRef.current) {
        observerRef.current.disconnect();
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
          <RouteTranslationHandler />  
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
