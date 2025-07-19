import React, { useState } from 'react';
import { Button } from './ui/button';
import { TransitionText } from './TransitionText';
import { useTranslation } from 'react-i18next';

export const TransitionDemo: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) return;
    
    await i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Text Transition Demo
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Main Title (with transition):
          </h4>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            <TransitionText as="span">
              {t('home.hero.title', 'Share Files Instantly')}
            </TransitionText>
          </h2>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Subtitle (with transition):
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            <TransitionText as="span">
              {t('home.hero.subtitle', 'Send files up to 2GB quickly and securely.')}
            </TransitionText>
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Navigation Links (with transition):
          </h4>
          <div className="flex gap-4">
            <span className="text-teal-600 dark:text-teal-400">
              <TransitionText>{t('common.home', 'Home')}</TransitionText>
            </span>
            <span className="text-teal-600 dark:text-teal-400">
              <TransitionText>{t('common.files', 'Files')}</TransitionText>
            </span>
            <span className="text-teal-600 dark:text-teal-400">
              <TransitionText>{t('common.settings', 'Settings')}</TransitionText>
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Switch Language to see transitions:
          </h4>
          <div className="flex gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage === lang.code ? "default" : "outline"}
                size="sm"
                onClick={() => handleLanguageChange(lang.code)}
                className="transition-all duration-200"
              >
                <TransitionText>{lang.name}</TransitionText>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 