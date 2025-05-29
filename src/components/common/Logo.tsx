import React from 'react';

interface LogoProps {
  size?: number;
  color?: 'primary' | 'white';
}

const Logo: React.FC<LogoProps> = ({ size = 24, color = 'primary' }) => {
  const primaryColor = color === 'primary' ? '#00afaf' : '#ffffff';
  const secondaryColor = color === 'primary' ? '#ffb900' : '#ffffff';
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 8L21 3"
        stroke={secondaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12V7"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;