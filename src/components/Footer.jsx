import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-dark text-neutral-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-neutral-800 text-center">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs sm:text-sm font-medium text-neutral-400">
          {t('footerCopyright')}
        </p>
      </div>
    </footer>
  );
}
