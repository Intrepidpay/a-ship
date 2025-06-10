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
  const observerRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    const currentLang = document.documentElement.lang || 'en';

    const shouldTranslate = savedLang !== 'en' && savedLang !== currentLang;

    const translateCurrentPage = async () => {
      if (shouldTranslate) {
        try {
          await applySavedLanguage(savedLang);
        } catch (error) {
          console.error('Navigation translation error:', error);
        }
      }
    };

    // Translate immediately after route change if needed
    requestAnimationFrame(() => {
      translateCurrentPage();
    });

    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Observe DOM changes and apply translation if needed
    if (savedLang !== 'en') {
      observerRef.current = new MutationObserver(() => {
        requestAnimationFrame(() => {
          translateCurrentPage();
        });
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
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
