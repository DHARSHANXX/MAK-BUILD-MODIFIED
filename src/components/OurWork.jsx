import React from 'react';
import { SITE, OUR_WORK_ITEMS } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { assetUrl } from '../utils/asset.js';

export function OurWork() {
  const { t } = useLanguage();

  return (
    <section id="work" className="py-16 sm:py-20 lg:py-24 bg-bg-dark text-text-light border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Instagram Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white tracking-tight mb-2">
              {t('workTitle')}
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-xl font-normal">
              {t('workSubtitle')}
            </p>
          </div>

          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-brand hover:text-amber-hover underline underline-offset-4 decoration-amber-brand/50 transition-colors shrink-0"
            title="Follow MAK BUILD on Instagram"
          >
            <span>{t('viewInstagram')}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* 4 Photos in a 2x2 Mobile / 4-Column Desktop Grid with 4:5 Aspect Ratio */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {OUR_WORK_ITEMS.map((item) => (
            <div 
              key={item.id}
              className="group relative aspect-[4/5] rounded overflow-hidden select-none border border-neutral-800 bg-neutral-900 flex flex-col justify-end"
            >
              {/* Picture element with WebP and Ken Burns slow 16s zoom loop */}
              <picture className="absolute inset-0 w-full h-full overflow-hidden">
                <source 
                  type="image/webp" 
                  srcSet={`${assetUrl(item.src.webp640)} 640w, ${assetUrl(item.src.webp)} 1280w`} 
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <img
                  src={assetUrl(item.src.jpg)}
                  alt={item.src.alt || item.title}
                  width={item.src.width}
                  height={item.src.height}
                  loading="lazy"
                  decoding="async"
                  className="ken-burns w-full h-full object-cover object-[center_30%]"
                />
              </picture>

              {/* Dark bottom gradient overlay for legible text */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Title & Location Footer */}
              <div className="relative z-10 p-3 sm:p-4 text-white">
                <h3 className="font-display text-sm sm:text-base text-white leading-tight">
                  {t(item.titleKey)}
                </h3>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  {item.location}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
