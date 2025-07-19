import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { cn } from '../lib/utils';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { i18n, t } = useTranslation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) return;
    
    setIsTransitioning(true);
    
    // Add a small delay to show the transition
    await new Promise(resolve => setTimeout(resolve, 150));
    
    await i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    
    // Keep transition state for a bit longer to ensure smooth fade
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            isTransitioning && "opacity-50",
            className
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.flag} {currentLang.name}</span>
          <span className="sm:hidden">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center justify-between cursor-pointer transition-all duration-200",
              currentLanguage === language.code && "bg-accent"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{language.flag}</span>
              <span className="transition-opacity duration-200">
                {language.name}
              </span>
            </div>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 text-primary transition-all duration-200" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 