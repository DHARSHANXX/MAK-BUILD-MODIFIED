import React from 'react';
import { SITE } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetUrl } from '../utils/asset.js';

export function Hero() {
  const { t } = useLanguage();

  const heroWaUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hi MAK BUILD, I'd like to book a free site visit.")}`;

  return (
    <section className="relative min-h-[88svh] flex items-end pt-24 pb-14 sm:pb-16 lg:pb-20 overflow-hidden bg-bg-dark">
      {/* Background Image Container with Villa */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <picture>
          <source 
            type="image/webp" 
            srcSet={`${assetUrl(SITE.heroImage.webp640)} 640w, ${assetUrl(SITE.heroImage.webp)} 1280w`} 
            sizes="(max-width: 640px) 640px, 100vw"
          />
          <img
            src={assetUrl(SITE.heroImage.jpg)}
            alt={SITE.heroImage.alt}
            width={SITE.heroImage.width}
            height={SITE.heroImage.height}
            fetchpriority="high"
            decoding="async"
            className="w-full h-full object-cover object-[center_30%] sm:object-[center_32%] lg:object-[65%_32%] select-none"
          />
        </picture>

        {/* Directional Dark Gradient Overlays for High Contrast Readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 pointer-events-none"
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
        <div className="max-w-3xl">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-brand" />
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-brand">
              {t('heroEyebrow')}
            </span>
          </div>

          {/* Huge Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-white tracking-tight leading-[1.1] mb-4">
            {t('heroHeading')}
          </h1>

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-neutral-200 mb-4 shadow-sm">
            <svg className="w-4 h-4 text-amber-brand shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="font-medium">
              {t('heroBadge')}
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-neutral-200 font-normal leading-relaxed max-w-2xl mb-8">
            {t('heroSubtitle')}
          </p>

          {/* ONE Primary Button: Book a free site visit */}
          <div>
            <a
              href={heroWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded text-sm sm:text-base font-semibold shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-brand transition-transform active:scale-95"
            >
              <span>{t('heroCta')}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
