import React from 'react';

interface LanguageSuggestionModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  suggestedLang: string;
  currentLang: string;
  suggestedFlag: string;
  currentFlag: string;
  suggestedName: string;
  currentName: string;
}

const LanguageSuggestionModal: React.FC<LanguageSuggestionModalProps> = ({
  open,
  onAccept,
  onDecline,
  suggestedLang,
  currentLang,
  suggestedFlag,
  currentFlag,
  suggestedName,
  currentName,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900/90 rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-200 dark:border-gray-700 animate-scale-in">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{suggestedFlag}</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{suggestedName}</span>
          </div>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
            {`We noticed you're visiting from a region where ${suggestedName} is popular. Would you like to switch your language to ${suggestedName}?`}
          </p>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onAccept}
              className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold py-2 rounded-lg shadow hover:from-teal-600 hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {suggestedFlag} Switch to {suggestedName}
            </button>
            <button
              onClick={onDecline}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {currentFlag} Keep {currentName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSuggestionModal; 