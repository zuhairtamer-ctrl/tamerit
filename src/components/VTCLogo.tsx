import React from 'react';

interface VTCLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'monochrome';
}

export const VTCLogo: React.FC<VTCLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  // Dimensions mapping
  const heightMap = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-20',
    xl: 'h-28',
  };

  const styleModifier = variant === 'monochrome' ? 'grayscale opacity-75' : '';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${styleModifier} ${className}`} dir="ltr">
      {/* SVG Container with the exact elements from the prompt logo */}
      <svg
        viewBox="0 0 520 200"
        className={`${heightMap[size]} w-auto max-w-full drop-shadow-xs`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="مؤسسة التدريب المهني - Vocational Training Corporation"
      >
        {/* Left Side: 50 YEARS Emblem in Gold Outline */}
        <g id="fifty-years" transform="translate(15, 15)">
          {/* Number 5 */}
          <path
            d="M20 30 H105 V60 H50 C75 60 95 72 95 105 C95 138 72 150 45 150 C25 150 10 142 5 130"
            fill="none"
            stroke="#C59B27"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 30 H105 V60 H50 C75 60 95 72 95 105 C95 138 72 150 45 150 C25 150 10 142 5 130"
            fill="none"
            stroke="#997316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Number 0 with ribbon intertwining */}
          <ellipse
            cx="145"
            cy="90"
            rx="48"
            ry="58"
            fill="none"
            stroke="#C59B27"
            strokeWidth="11"
          />
          <ellipse
            cx="145"
            cy="90"
            rx="48"
            ry="58"
            fill="none"
            stroke="#997316"
            strokeWidth="3"
          />
          
          {/* Inner cutout text YEARS */}
          <text
            x="145"
            y="96"
            textAnchor="middle"
            fill="#997316"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fontSize="18"
            letterSpacing="3"
          >
            YEARS
          </text>
        </g>

        {/* Center: Red Square with White Abstract Dynamic Figure */}
        <g id="vtc-icon" transform="translate(235, 20)">
          <rect width="135" height="135" rx="8" fill="#E30613" />
          {/* Stylized human head circle/oval */}
          <ellipse cx="68" cy="38" rx="28" ry="14" fill="#ffffff" />
          
          {/* Curved swoosh dynamic body */}
          <path
            d="M1 92 C32 80 50 68 85 70 C72 100 48 122 45 135 H25 C25 130 35 110 52 95 C38 98 20 102 1 115 Z"
            fill="#ffffff"
          />
          <path
            d="M85 70 C80 90 60 120 40 135 H25 C45 110 65 92 85 70 Z"
            fill="#ffffff"
          />
          <path
            d="M0 96 C30 84 55 70 85 70 C70 95 45 125 30 135 H15 C35 115 50 95 0 96 Z"
            fill="#ffffff"
          />
        </g>

        {/* Right Side: Arabic Typography "مؤسسة التدريب المهني" */}
        <g id="arabic-text" transform="translate(390, 48)">
          <text
            x="120"
            y="0"
            textAnchor="end"
            fill="#1E293B"
            fontFamily="'Tajawal', 'Cairo', 'Arial', sans-serif"
            fontWeight="900"
            fontSize="32"
          >
            مؤسسة
          </text>
          <text
            x="120"
            y="42"
            textAnchor="end"
            fill="#1E293B"
            fontFamily="'Tajawal', 'Cairo', 'Arial', sans-serif"
            fontWeight="900"
            fontSize="32"
          >
            التـدريـب
          </text>
          <text
            x="120"
            y="84"
            textAnchor="end"
            fill="#1E293B"
            fontFamily="'Tajawal', 'Cairo', 'Arial', sans-serif"
            fontWeight="900"
            fontSize="32"
          >
            المـهـنـي
          </text>
        </g>

        {/* Bottom Full Width: "VOCATIONAL TRAINING CORPORATION" */}
        <text
          x="260"
          y="186"
          textAnchor="middle"
          fill="#27272A"
          fontFamily="'Arial', 'Segoe UI', sans-serif"
          fontWeight="800"
          fontSize="23"
          letterSpacing="1.5"
        >
          VOCATIONAL TRAINING CORPORATION
        </text>
      </svg>
    </div>
  );
};
