'use client';

import React from 'react';

export default function MoleculeOrbit() {
  return (
    <div className="h-16 w-full flex items-center justify-center select-none pointer-events-none">
      <svg className="w-10 h-10 animate-[spin_16s_linear_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connective bonds */}
        <line x1="50" y1="50" x2="80" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <line x1="50" y1="50" x2="20" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <line x1="50" y1="50" x2="25" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <line x1="50" y1="50" x2="75" y2="75" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        
        {/* Central atom */}
        <circle cx="50" cy="50" r="10" fill="url(#gradCenter)" />
        
        {/* Surrounding atoms with high-tech radial gradients */}
        <circle cx="80" cy="30" r="6" fill="url(#gradGreen)" />
        <circle cx="20" cy="70" r="6" fill="url(#gradGreen)" />
        <circle cx="25" cy="25" r="5" fill="#FF4757" />
        <circle cx="75" cy="75" r="5" fill="#FFB300" />
        
        <defs>
          <radialGradient id="gradCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#0083B0" />
          </radialGradient>
          <radialGradient id="gradGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#00A85A" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
