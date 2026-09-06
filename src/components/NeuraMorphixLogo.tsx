import React from 'react';

interface NeuraMorphixLogoProps {
  className?: string;
  size?: number;
}

export const NeuraMorphixLogo: React.FC<NeuraMorphixLogoProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <img
      src="/logo.png"
      alt="NeuraMorphix Logo"
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`object-contain transition-transform duration-300 hover:scale-105 ${className}`}
    />
  );
};
