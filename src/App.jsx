import React from 'react';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { WhyStrip } from './components/WhyStrip.jsx';
import { Packages } from './components/Packages.jsx';
import { OurWork } from './components/OurWork.jsx';
import { Contact } from './components/Contact.jsx';
import { Footer } from './components/Footer.jsx';
import { StickyWhatsApp } from './components/StickyWhatsApp.jsx';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bg-light text-text-main flex flex-col font-sans selection:bg-amber-brand selection:text-text-main">
        {/* Fixed Header with Brand & Language Toggle Pill (Top-Right) */}
        <Header />

        {/* Main Content Sections: Hero → Why strip → Packages → Our Work → Contact */}
        <main className="flex-1">
          <Hero />
          <WhyStrip />
          <Packages />
          <OurWork />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Fixed Floating WhatsApp Button (Mobile Only, Bottom-Right) */}
        <StickyWhatsApp />
      </div>
    </LanguageProvider>
  );
}
