"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
}

/**
 * MAK BUILD — Architectural Aurora Background Component
 * Adapted to the MAK BUILD warm white, ivory, champagne, muted gold,
 * warm beige, and charcoal architectural palette.
 */
export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen w-full bg-[#080b11] text-slate-100 transition-bg overflow-x-hidden",
        className
      )}
      {...props}
    >
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
        aria-hidden="true"
      >
        <div
          className={cn(
            `
            [--white:#faf8f2]
            [--black:#080b11]
            [--transparent:transparent]
            [--mak-gold-champagne:#fceda2]
            [--mak-ivory:#f8f5ec]
            [--mak-gold-muted:#d4af37]
            [--mak-warm-beige:#e6dec8]
            [--mak-gold-soft:#c9982d]
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--mak-gold-champagne)_10%,var(--mak-ivory)_15%,var(--mak-gold-muted)_20%,var(--mak-warm-beige)_25%,var(--mak-gold-soft)_30%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px]
            after:content-[""]
            after:absolute
            after:inset-0
            after:[background-image:var(--dark-gradient),var(--aurora)]
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora
            after:[background-attachment:fixed]
            after:mix-blend-screen
            pointer-events-none
            absolute
            -inset-[10px]
            opacity-65
            will-change-transform
            `,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        ></div>
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default AuroraBackground;
