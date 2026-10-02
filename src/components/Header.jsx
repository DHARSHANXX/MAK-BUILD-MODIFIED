import React from 'react';
import { SITE } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetUrl } from '../utils/asset.js';

export function Header() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-light/95 backdrop-blur-sm border-b border-border-subtle h-16 transition-none">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        {/* Brand / Logo Block */}
        <a 
          href="#" 
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-brand shrink-0"
        >
          <picture className="shrink-0 flex items-center">
            <source type="image/webp" srcSet={assetUrl(SITE.logo)} />
            <img 
              src={assetUrl(SITE.logoPng)} 
              alt="" 
              aria-hidden="true"
              className="h-8 sm:h-9 w-auto object-contain shrink-0"
              width="47"
              height="36"
            />
          </picture>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg tracking-tight leading-none text-text-main">
              {SITE.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted mt-0.5 hidden min-[360px]:block">
              {t('brandTagline')}
            </span>
          </div>
        </a>

        {/* Fixed Language Switch Pill Button (Top-Right) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLang}
            className="px-3 py-1.5 text-xs font-semibold rounded-full border border-text-main/25 hover:border-text-main/70 bg-white shadow-sm text-text-main transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-brand flex items-center gap-1.5"
            title={t('ariaLangToggle')}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-brand" aria-hidden="true" />
            <span>{t('langLabel')}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
