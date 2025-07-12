import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';
import Download from './pages/Download';
import Share from './pages/Share';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Stats from './pages/Stats';
import History from './pages/History';
import Settings from './pages/Settings';
import Features from './pages/Features';
import AdvancedFileManager from './components/AdvancedFileManager';
import AIFileAnalyzer from './components/AIFileAnalyzer';
import RealTimeCollaboration from './components/RealTimeCollaboration';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/download" element={<Download />} />
              <Route path="/share/:shareId" element={<Share />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              {/* Advanced Features Routes */}
              <Route path="/file-manager" element={<AdvancedFileManager />} />
              <Route path="/ai-analyzer" element={<AIFileAnalyzer />} />
              <Route path="/collaboration" element={<RealTimeCollaboration />} />
              <Route path="/analytics" element={<AdvancedAnalytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
