import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// 🚕 Custom detailed Taxi Cab Icon with rooftop light
export const TaxiIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Taxi roof sign */}
    <path d="M10 2h4v2h-4z" fill={color} fillOpacity="0.2" />
    {/* Car body */}
    <path d="M4 14l1.5-6h13l1.5 6" />
    <path d="M3 14h18v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0h-6a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4z" />
    {/* Headlights */}
    <circle cx="6.5" cy="15.5" r="1" fill={color} />
    <circle cx="17.5" cy="15.5" r="1" fill={color} />
    {/* Wheels */}
    <circle cx="7" cy="19" r="1.5" fill={color} />
    <circle cx="17" cy="19" r="1.5" fill={color} />
  </svg>
);

// 🚗 Private Car / Sedan Icon
export const PrivateCarIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 13l2-6h10l2 6" />
    <path d="M3 13h18v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
    <path d="M7 13h10" />
  </svg>
);

// 🚌 Jammu Smart City E-Bus / Matador Icon
export const CityBusIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Bus body */}
    <rect x="4" y="3" width="16" height="15" rx="3" />
    {/* Windshield */}
    <path d="M4 9h16" />
    <path d="M12 3v6" />
    {/* Headlights */}
    <circle cx="7.5" cy="14.5" r="1" fill={color} />
    <circle cx="16.5" cy="14.5" r="1" fill={color} />
    {/* Wheels */}
    <circle cx="7" cy="18" r="2" fill={color} />
    <circle cx="17" cy="18" r="2" fill={color} />
    {/* Bumper */}
    <path d="M9 18h6" />
  </svg>
);

// 🛺 Auto Rickshaw / E-Rickshaw Icon
export const AutoRickshawIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Rickshaw canopy */}
    <path d="M4 11V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
    {/* Front handlebar & wheel fork */}
    <path d="M16 11l4 2v3" />
    <circle cx="19" cy="18" r="2" />
    {/* Rear wheel and passenger seat */}
    <path d="M3 13h12v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3z" />
    <circle cx="7" cy="18" r="2" />
    {/* Door opening */}
    <path d="M9 5v6" />
  </svg>
);

// 🚆 Train / Vande Bharat Express Icon
export const ExpressTrainIcon: React.FC<IconProps> = ({ size = 20, className = '', color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="5" y="3" width="14" height="14" rx="4" />
    <path d="M5 10h14" />
    <circle cx="8.5" cy="14" r="1" fill={color} />
    <circle cx="15.5" cy="14" r="1" fill={color} />
    {/* Tracks */}
    <path d="M7 17l-3 4" />
    <path d="M17 17l3 4" />
    <path d="M6 19h12" />
  </svg>
);
