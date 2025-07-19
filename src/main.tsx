import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './i18n';
import { getUserCountryCode, getLanguageFromCountry } from './services/geoLocation';
import i18n from 'i18next';

console.log('main.tsx executing');

// Language detection and suggestion logic
const detectAndSuggestLanguage = async () => {
  try {
    console.log('🔍 Starting geolocation language detection...');
    
    const countryCode = await getUserCountryCode();
    console.log('🌍 Detected country code:', countryCode);
    
    if (countryCode) {
      const suggestedLanguage = getLanguageFromCountry(countryCode);
      console.log('💡 Suggested language:', suggestedLanguage);
      console.log('🌐 Current language:', i18n.language);
      
      if (suggestedLanguage && i18n.language !== suggestedLanguage) {
        console.log('🔄 Switching language to:', suggestedLanguage);
        i18n.changeLanguage(suggestedLanguage);
      } else {
        console.log('✅ Language already set or no suggestion available');
      }
    } else {
      console.log('❌ Could not detect country code');
    }
  } catch (error) {
    console.error('🚨 Error in language detection:', error);
  }
};

// Run language detection on app startup
detectAndSuggestLanguage();

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found!');
}
