'use client';

import React from 'react';

export function RadarIllustration() {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="capabilities-illustration"
    >
      <defs>
        {/* Amber gradient */}
        <linearGradient id="radar-amber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC24A" />
          <stop offset="50%" stopColor="#E9931E" />
          <stop offset="100%" stopColor="#A85A0C" />
        </linearGradient>

        {/* Central orb radial */}
        <radialGradient id="radar-orb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC24A" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#E9931E" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#A85A0C" stopOpacity="0" />
        </radialGradient>

        {/* Glow filter */}
        <filter id="radar-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Soft outer glow */}
        <filter id="radar-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Radial fade mask */}
        <radialGradient id="radar-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="radar-mask">
          <rect width="260" height="260" fill="url(#radar-fade)" />
        </mask>
      </defs>

      <g mask="url(#radar-mask)">
        {/* Ambient soft glow */}
        <circle cx="130" cy="130" r="85" fill="none" stroke="#BE7016" strokeOpacity="0.06" strokeWidth="70" />

        {/* Concentric radar rings */}
        <g filter="url(#radar-glow)">
          <circle cx="130" cy="130" r="22" stroke="url(#radar-amber)" strokeWidth="0.7" strokeOpacity="0.8" />
          <circle cx="130" cy="130" r="42" stroke="url(#radar-amber)" strokeWidth="0.6" strokeOpacity="0.55" />
          <circle cx="130" cy="130" r="62" stroke="url(#radar-amber)" strokeWidth="0.55" strokeOpacity="0.4" />
          <circle cx="130" cy="130" r="82" stroke="url(#radar-amber)" strokeWidth="0.5" strokeOpacity="0.3" />
          <circle cx="130" cy="130" r="100" stroke="url(#radar-amber)" strokeWidth="0.45" strokeOpacity="0.2" />
        </g>

        {/* Cross-hair lines */}
        <line x1="130" y1="28" x2="130" y2="232" stroke="#E9931E" strokeWidth="0.35" strokeOpacity="0.15" />
        <line x1="28" y1="130" x2="232" y2="130" stroke="#E9931E" strokeWidth="0.35" strokeOpacity="0.15" />
        <line x1="58" y1="58" x2="202" y2="202" stroke="#E9931E" strokeWidth="0.25" strokeOpacity="0.08" />
        <line x1="202" y1="58" x2="58" y2="202" stroke="#E9931E" strokeWidth="0.25" strokeOpacity="0.08" />

        {/* Central orb */}
        <circle cx="130" cy="130" r="8" fill="url(#radar-orb)" filter="url(#radar-soft-glow)" />
        <circle cx="130" cy="130" r="3.5" fill="#FFC24A" fillOpacity="0.95" />

        {/* Signal dot on outer ring */}
        <g filter="url(#radar-soft-glow)">
          <circle cx="205" cy="87" r="4.5" fill="#FFC24A" fillOpacity="0.9" />
          <circle cx="205" cy="87" r="2" fill="#FFF" fillOpacity="0.6" />
        </g>

        {/* Second faint signal dot */}
        <g filter="url(#radar-glow)">
          <circle cx="82" cy="185" r="3" fill="#E9931E" fillOpacity="0.5" />
        </g>

        {/* Sweep arc hint */}
        <path
          d="M 130 130 L 205 87"
          stroke="url(#radar-amber)"
          strokeWidth="0.5"
          strokeOpacity="0.25"
        />
      </g>
    </svg>
  );
}
