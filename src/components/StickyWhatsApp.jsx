import React from 'react';
import { SITE } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export function StickyWhatsApp() {
  const { t } = useLanguage();
  const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hi MAK BUILD, I would like to enquire about home construction in Sirkazhi.")}`;

  return (
    <div className="md:hidden fixed bottom-5 right-5 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] transition-transform active:scale-95"
        aria-label={t('whatsappCta')}
        title={t('whatsappCta')}
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.54 1.777.818 2.801.819h.005c3.182 0 5.768-2.587 5.769-5.766 0-3.18-2.587-5.766-5.77-5.766zm9.969 5.767c0 5.518-4.482 10-10 10-1.745 0-3.385-.45-4.818-1.238l-5.182 1.356 1.378-5.039c-.878-1.492-1.378-3.23-1.378-5.079 0-5.518 4.482-10 10-10s10 4.482 10 10z"/>
        </svg>
      </a>
    </div>
  );
}
