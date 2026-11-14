'use client';

import React from 'react';

export function ReportingIllustration() {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="capabilities-illustration"
    >
      <defs>
        <linearGradient id="rpt-amber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC24A" />
          <stop offset="50%" stopColor="#E9931E" />
          <stop offset="100%" stopColor="#A85A0C" />
        </linearGradient>

        <linearGradient id="rpt-surface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFC24A" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#A85A0C" stopOpacity="0.03" />
        </linearGradient>

        <filter id="rpt-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="rpt-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <radialGradient id="rpt-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="rpt-mask">
          <rect width="260" height="260" fill="url(#rpt-fade)" />
        </mask>
      </defs>

      <g mask="url(#rpt-mask)">
        {/* Ambient glow */}
        <circle cx="130" cy="130" r="75" fill="#BE7016" fillOpacity="0.04" />

        {/* Back document sheet */}
        <g filter="url(#rpt-glow)" transform="translate(8, -8)">
          <path
            d="M 75 52 L 185 52 L 185 210 L 75 210 Z"
            fill="url(#rpt-surface)"
            stroke="url(#rpt-amber)"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
          {/* Text lines */}
          <line x1="90" y1="80" x2="155" y2="80" stroke="#E9931E" strokeWidth="0.6" strokeOpacity="0.15" />
          <line x1="90" y1="96" x2="145" y2="96" stroke="#E9931E" strokeWidth="0.6" strokeOpacity="0.12" />
          <line x1="90" y1="112" x2="160" y2="112" stroke="#E9931E" strokeWidth="0.6" strokeOpacity="0.1" />
        </g>

        {/* Middle document sheet */}
        <g filter="url(#rpt-glow)" transform="translate(4, -4)">
          <path
            d="M 75 52 L 185 52 L 185 210 L 75 210 Z"
            fill="url(#rpt-surface)"
            stroke="url(#rpt-amber)"
            strokeWidth="0.55"
            strokeOpacity="0.3"
          />
          <line x1="90" y1="80" x2="160" y2="80" stroke="#E9931E" strokeWidth="0.7" strokeOpacity="0.2" />
          <line x1="90" y1="96" x2="150" y2="96" stroke="#E9931E" strokeWidth="0.7" strokeOpacity="0.17" />
          <line x1="90" y1="112" x2="165" y2="112" stroke="#E9931E" strokeWidth="0.7" strokeOpacity="0.14" />
          <line x1="90" y1="128" x2="140" y2="128" stroke="#E9931E" strokeWidth="0.7" strokeOpacity="0.12" />
        </g>

        {/* Front document sheet */}
        <g filter="url(#rpt-glow)">
          <path
            d="M 75 52 L 185 52 L 185 210 L 75 210 Z"
            fill="url(#rpt-surface)"
            stroke="url(#rpt-amber)"
            strokeWidth="0.6"
            strokeOpacity="0.45"
          />
          {/* Header bar */}
          <rect x="85" y="64" width="35" height="4" rx="2" fill="#FFC24A" fillOpacity="0.35" />

          {/* Text lines */}
          <line x1="85" y1="84" x2="165" y2="84" stroke="#FFC24A" strokeWidth="0.8" strokeOpacity="0.3" />
          <line x1="85" y1="100" x2="155" y2="100" stroke="#FFC24A" strokeWidth="0.7" strokeOpacity="0.25" />
          <line x1="85" y1="116" x2="170" y2="116" stroke="#FFC24A" strokeWidth="0.7" strokeOpacity="0.22" />
          <line x1="85" y1="132" x2="145" y2="132" stroke="#FFC24A" strokeWidth="0.7" strokeOpacity="0.2" />
          <line x1="85" y1="148" x2="162" y2="148" stroke="#FFC24A" strokeWidth="0.6" strokeOpacity="0.17" />
          <line x1="85" y1="164" x2="135" y2="164" stroke="#FFC24A" strokeWidth="0.6" strokeOpacity="0.14" />

          {/* Small chart indicator */}
          <rect x="85" y="178" width="12" height="18" rx="2" fill="#FFC24A" fillOpacity="0.12" stroke="#FFC24A" strokeWidth="0.4" strokeOpacity="0.2" />
          <rect x="102" y="184" width="12" height="12" rx="2" fill="#FFC24A" fillOpacity="0.08" stroke="#FFC24A" strokeWidth="0.4" strokeOpacity="0.15" />
          <rect x="119" y="180" width="12" height="16" rx="2" fill="#FFC24A" fillOpacity="0.1" stroke="#FFC24A" strokeWidth="0.4" strokeOpacity="0.18" />
        </g>

        {/* Corner fold on front sheet */}
        <path
          d="M 170 52 L 185 52 L 185 67 Z"
          fill="#FFC24A"
          fillOpacity="0.06"
          stroke="url(#rpt-amber)"
          strokeWidth="0.4"
          strokeOpacity="0.2"
        />
      </g>
    </svg>
  );
}
