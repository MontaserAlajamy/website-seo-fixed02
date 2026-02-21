import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ContactFormNew from './components/contact/ContactFormNew';
import ParticlesBackground from './components/ParticlesBackground';
import TianjiScript from './components/TianjiScript';

// Lazy-load pages that aren't needed on initial render
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Photography = React.lazy(() => import('./pages/Photography'));
const Album = React.lazy(() => import('./pages/Album'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));

function LazyFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <ParticlesBackground />
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main>
          <React.Suspense fallback={<LazyFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/photography" element={<Photography />} />
              <Route path="/photography/:albumId" element={<Album />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </React.Suspense>
        </main>
        <Footer />
        <ContactFormNew />
      </div>
      <TianjiScript />
    </Router>
  );
}

export default App;
