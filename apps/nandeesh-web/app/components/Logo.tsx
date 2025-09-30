'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Central vertical bars - two thick parallel bars */}
        <rect x="42" y="15" width="8" height="50" fill="#D4AF37" rx="2"/>
        <rect x="50" y="15" width="8" height="50" fill="#D4AF37" rx="2"/>
        
        {/* Base inverted V connection */}
        <path d="M42 65 L50 80 L58 65" stroke="#D4AF37" strokeWidth="4" fill="none" strokeLinecap="round"/>
        
        {/* Top circles - stacked vertically */}
        <circle cx="50" cy="40" r="10" fill="#D4AF37"/>
        <circle cx="50" cy="25" r="7" fill="#D4AF37"/>
        
        {/* Horizontal rectangular extensions - shorter rectangular shapes */}
        <rect x="30" y="35" width="12" height="10" fill="#D4AF37" rx="2"/>
        <rect x="58" y="35" width="12" height="10" fill="#D4AF37" rx="2"/>
        
        {/* Left side element - curved inward then outward with rounded bottom */}
        <path d="M30 40 L20 50 Q15 55 20 60 L25 65 Q30 70 35 65 L40 60 Q45 55 40 50 L35 45" 
              stroke="#D4AF37" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round"/>
        
        {/* Right side element - mirrored */}
        <path d="M70 40 L80 50 Q85 55 80 60 L75 65 Q70 70 65 65 L60 60 Q55 55 60 50 L65 45" 
              stroke="#D4AF37" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// Text logo variant for when you want text alongside
export function LogoWithText({ className = '', size = 'md' }: LogoProps) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl', 
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Logo size={size} />
      <span className={`font-bold text-gray-900 ${textSizes[size]}`}>
        LNN Legal
      </span>
    </div>
  );
}
