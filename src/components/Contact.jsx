import React from 'react';
import { SITE } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export function Contact() {
  const { t } = useLanguage();

  const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hi MAK BUILD, I would like to book a free site consultation.")}`;

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-bg-light border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-text-main tracking-tight mb-3">
            {t('contactTitle')}
          </h2>
          <p className="text-base sm:text-lg text-text-muted font-normal">
            {t('contactSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Big WhatsApp Button + Phone, Email & Address Details */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* One Big WhatsApp CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full p-4 sm:p-5 text-base sm:text-lg font-semibold shadow-md flex items-center justify-center gap-3 text-center transition-transform active:scale-95"
            >
              <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.54 1.777.818 2.801.819h.005c3.182 0 5.768-2.587 5.769-5.766 0-3.18-2.587-5.766-5.77-5.766zm9.969 5.767c0 5.518-4.482 10-10 10-1.745 0-3.385-.45-4.818-1.238l-5.182 1.356 1.378-5.039c-.878-1.492-1.378-3.23-1.378-5.079 0-5.518 4.482-10 10-10s10 4.482 10 10z"/>
              </svg>
              <span>{t('whatsappCta')}</span>
            </a>

            {/* Direct Contact Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Primary Phone */}
              <a
                href={`tel:${SITE.phonePrimary}`}
                className="bg-white p-4 rounded border border-border-subtle hover:border-text-main/40 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded bg-bg-light border border-border-subtle flex items-center justify-center text-text-main shrink-0" aria-hidden="true">
                  📞
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Phone (Primary)
                  </span>
                  <span className="text-sm font-bold text-text-main truncate">
                    {SITE.phonePrimaryDisplay}
                  </span>
                </div>
              </a>

              {/* Secondary Phone */}
              <a
                href={`tel:${SITE.phoneSecondary}`}
                className="bg-white p-4 rounded border border-border-subtle hover:border-text-main/40 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded bg-bg-light border border-border-subtle flex items-center justify-center text-text-main shrink-0" aria-hidden="true">
                  📱
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Phone (Site Visits)
                  </span>
                  <span className="text-sm font-bold text-text-main truncate">
                    {SITE.phoneSecondaryDisplay}
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${SITE.email}`}
                className="bg-white p-4 rounded border border-border-subtle hover:border-text-main/40 transition-colors flex items-center gap-3 sm:col-span-2"
              >
                <div className="w-10 h-10 rounded bg-bg-light border border-border-subtle flex items-center justify-center text-text-main shrink-0" aria-hidden="true">
                  ✉️
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Email
                  </span>
                  <span className="text-sm font-bold text-text-main truncate">
                    {SITE.email}
                  </span>
                </div>
              </a>

              {/* Address */}
              <div className="bg-white p-4 rounded border border-border-subtle flex items-start gap-3 sm:col-span-2">
                <div className="w-10 h-10 rounded bg-bg-light border border-border-subtle flex items-center justify-center text-text-main shrink-0 mt-0.5" aria-hidden="true">
                  📍
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Office Address
                  </span>
                  <span className="text-sm font-medium text-text-main leading-relaxed mt-0.5">
                    {SITE.address}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Google Maps Iframe Embed */}
          <div className="lg:col-span-6 h-[320px] sm:h-[400px] w-full rounded overflow-hidden border border-border-subtle bg-white shadow-sm">
            <iframe
              title="MAK BUILD Office Location in Sirkazhi"
              src={SITE.googleMapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
