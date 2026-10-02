import React from 'react';
import { WHY_STRIP_ITEMS } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export function WhyStrip() {
  const { t } = useLanguage();

  return (
    <section className="bg-bg-light border-b border-border-subtle py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 items-center">
          {WHY_STRIP_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-2.5 text-text-main text-xs sm:text-sm font-semibold tracking-tight"
            >
              {/* Checkmark icon */}
              <div className="w-5 h-5 rounded-full bg-amber-brand/20 text-amber-dark flex items-center justify-center shrink-0" aria-hidden="true">
                <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="leading-snug">
                {t(item.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
