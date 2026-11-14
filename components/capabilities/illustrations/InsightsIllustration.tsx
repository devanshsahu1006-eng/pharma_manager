'use client';

import React from 'react';

export function InsightsIllustration() {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="capabilities-illustration"
    >
      <defs>
        <linearGradient id="ins-amber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC24A" />
          <stop offset="50%" stopColor="#E9931E" />
          <stop offset="100%" stopColor="#A85A0C" />
        </linearGradient>

        <linearGradient id="ins-bar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFC24A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#A85A0C" stopOpacity="0.2" />
        </linearGradient>

        <filter id="ins-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="ins-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <radialGradient id="ins-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="ins-mask">
          <rect width="260" height="260" fill="url(#ins-fade)" />
        </mask>
      </defs>

      <g mask="url(#ins-mask)">
        {/* Ambient glow */}
        <circle cx="130" cy="140" r="70" fill="#BE7016" fillOpacity="0.04" />

        {/* Bar chart cylinders */}
        <g filter="url(#ins-glow)">
          {/* Bar 1 */}
          <rect x="55" y="120" width="14" height="72" rx="7" fill="url(#ins-bar)" />
          <ellipse cx="62" cy="120" rx="7" ry="3.5" fill="#FFC24A" fillOpacity="0.6" />

          {/* Bar 2 */}
          <rect x="82" y="88" width="14" height="104" rx="7" fill="url(#ins-bar)" />
          <ellipse cx="89" cy="88" rx="7" ry="3.5" fill="#FFC24A" fillOpacity="0.6" />

          {/* Bar 3 */}
          <rect x="109" y="105" width="14" height="87" rx="7" fill="url(#ins-bar)" />
          <ellipse cx="116" cy="105" rx="7" ry="3.5" fill="#FFC24A" fillOpacity="0.6" />

          {/* Bar 4 */}
          <rect x="136" y="72" width="14" height="120" rx="7" fill="url(#ins-bar)" />
          <ellipse cx="143" cy="72" rx="7" ry="3.5" fill="#FFC24A" fillOpacity="0.7" />

          {/* Base line */}
          <line x1="45" y1="192" x2="160" y2="192" stroke="#E9931E" strokeWidth="0.5" strokeOpacity="0.3" />
        </g>

        {/* Wireframe spheres — right side */}
        <g filter="url(#ins-glow)">
          {/* Sphere 1 */}
          <circle cx="192" cy="130" r="32" stroke="url(#ins-amber)" strokeWidth="0.6" strokeOpacity="0.35" />
          <ellipse cx="192" cy="130" rx="32" ry="12" stroke="url(#ins-amber)" strokeWidth="0.5" strokeOpacity="0.25" />
          <ellipse cx="192" cy="130" rx="12" ry="32" stroke="url(#ins-amber)" strokeWidth="0.5" strokeOpacity="0.25" />

          {/* Sphere 2 (overlapping, offset) */}
          <circle cx="180" cy="142" r="26" stroke="url(#ins-amber)" strokeWidth="0.5" strokeOpacity="0.25" />
          <ellipse cx="180" cy="142" rx="26" ry="10" stroke="url(#ins-amber)" strokeWidth="0.4" strokeOpacity="0.18" />
          <ellipse cx="180" cy="142" rx="10" ry="26" stroke="url(#ins-amber)" strokeWidth="0.4" strokeOpacity="0.18" />
        </g>

        {/* Three horizontal dashes above */}
        <g filter="url(#ins-glow)">
          <rect x="75" y="52" width="18" height="2.5" rx="1.25" fill="#FFC24A" fillOpacity="0.7" />
          <rect x="100" y="52" width="18" height="2.5" rx="1.25" fill="#E9931E" fillOpacity="0.55" />
          <rect x="125" y="52" width="18" height="2.5" rx="1.25" fill="#A85A0C" fillOpacity="0.4" />
        </g>
      </g>
    </svg>
  );
}
