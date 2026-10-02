import React from 'react';
import { SITE, PACKAGES, CORE_SPECS, FULL_SPECS_TABLE } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export function Packages() {
  const { t } = useLanguage();

  const getPackageWaUrl = (pkg) => {
    const text = `Hi MAK BUILD, I would like to get a quote for the ${pkg.name} Package (₹${pkg.rate}/sq.ft).`;
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="packages" className="py-16 sm:py-20 lg:py-24 bg-bg-light border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-text-main tracking-tight mb-3">
            {t('packagesTitle')}
          </h2>
          <p className="text-base sm:text-lg text-text-muted font-normal">
            {t('packagesSubtitle')}
          </p>
        </div>

        {/* 3 Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-12">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded border flex flex-col justify-between p-6 sm:p-7 relative transition-all ${pkg.cardBg}`}
            >
              {/* Popular Badge on Moderate */}
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 px-3.5 py-0.5 rounded-full bg-amber-brand text-text-main text-xs font-bold uppercase tracking-wider shadow-sm">
                  {t('popularBadge')}
                </div>
              )}

              {/* Card Header */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-2xl font-display text-text-main">
                    {t(pkg.nameKey)}
                  </h3>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl sm:text-4xl font-display text-text-main">
                      ₹{pkg.rate}
                    </span>
                    <span className="text-xs sm:text-sm text-text-muted font-semibold">
                      {pkg.unit}
                    </span>
                  </div>
                </div>

                {/* One line note */}
                <p className="text-xs sm:text-sm text-text-muted min-h-[2.5rem] mb-6 font-normal">
                  {t(pkg.taglineKey)}
                </p>

                {/* First 7 Spec Rows */}
                <div className="space-y-2.5 pt-4 border-t border-border-subtle mb-8">
                  {CORE_SPECS.map((spec) => (
                    <div key={spec.itemKey} className="flex justify-between items-start text-xs sm:text-sm gap-2">
                      <span className="text-text-muted font-medium shrink-0">
                        {t(spec.itemKey)}:
                      </span>
                      <span className="text-text-main font-semibold text-right">
                        {spec[pkg.id]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* "Get {name} quote" WhatsApp Button */}
              <div>
                <a
                  href={getPackageWaUrl(pkg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 text-center transition-transform active:scale-95 shadow-sm ${
                    pkg.popular
                      ? 'btn-primary'
                      : 'bg-white hover:bg-neutral-50 text-text-main border border-text-main/20 hover:border-text-main/60'
                  }`}
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.54 1.777.818 2.801.819h.005c3.182 0 5.768-2.587 5.769-5.766 0-3.18-2.587-5.766-5.77-5.766zm9.969 5.767c0 5.518-4.482 10-10 10-1.745 0-3.385-.45-4.818-1.238l-5.182 1.356 1.378-5.039c-.878-1.492-1.378-3.23-1.378-5.079 0-5.518 4.482-10 10-10s10 4.482 10 10z"/>
                  </svg>
                  <span>{t('getQuoteFor', { name: t(pkg.nameKey) })}</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Expandable "Compare full specification" Details Table */}
        <details className="group bg-white rounded border border-border-subtle p-4 sm:p-6 transition-all duration-200">
          <summary className="font-display text-base sm:text-lg text-text-main cursor-pointer list-none flex items-center justify-between gap-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-brand">
            <span className="flex items-center gap-2">
              <span className="text-amber-brand">📋</span>
              <span>{t('compareFullSpecs')}</span>
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-muted group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>

          <div className="mt-6 pt-4 border-t border-border-subtle overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-border-subtle text-text-main">
                  <th className="py-3 px-3 font-display uppercase tracking-wider text-xs">
                    {t('specItemHeader')}
                  </th>
                  <th className="py-3 px-3 font-display text-center">
                    {t('pkgBasicName')} (₹2200)
                  </th>
                  <th className="py-3 px-3 font-display text-center bg-amber-brand/10 text-text-main rounded-t">
                    {t('pkgModerateName')} (₹2400) ★
                  </th>
                  <th className="py-3 px-3 font-display text-center">
                    {t('pkgPremiumName')} (₹2500)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {FULL_SPECS_TABLE.map((row, idx) => (
                  <tr key={row.itemKey} className={idx % 2 === 0 ? 'bg-white' : 'bg-bg-light/50'}>
                    <td className="py-3 px-3 font-medium text-text-main">
                      {t(row.itemKey)}
                    </td>
                    <td className="py-3 px-3 text-center text-text-muted">
                      {row.isCheck ? (
                        row.basic ? (
                          <span className="text-emerald-700 font-bold text-base">✓</span>
                        ) : (
                          <span className="text-neutral-400 font-bold">—</span>
                        )
                      ) : (
                        row.basic
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-text-main bg-amber-brand/5">
                      {row.isCheck ? (
                        row.moderate ? (
                          <span className="text-emerald-700 font-bold text-base">✓</span>
                        ) : (
                          <span className="text-neutral-400 font-bold">—</span>
                        )
                      ) : (
                        row.moderate
                      )}
                    </td>
                    <td className="py-3 px-3 text-center text-text-muted">
                      {row.isCheck ? (
                        row.premium ? (
                          <span className="text-emerald-700 font-bold text-base">✓</span>
                        ) : (
                          <span className="text-neutral-400 font-bold">—</span>
                        )
                      ) : (
                        row.premium
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <p className="mt-4 text-[11px] text-text-muted italic">
              * {t('specsNote')}
            </p>
          </div>
        </details>

      </div>
    </section>
  );
}
