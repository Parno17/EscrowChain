import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'icon';
}

// ─── EscrowChain Brand Logo ──────────────────────────────────────────────────
export const EscrowChainLogo: React.FC<LogoProps> = ({
  size = 40,
  className = '',
  variant = 'icon',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EscrowChain Logo"
    >
      {/* Outer hexagon ring – chain link feel */}
      <polygon
        points="20,2 35,10 35,30 20,38 5,30 5,10"
        fill="none"
        stroke="url(#ecGrad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Inner shield */}
      <path
        d="M20 9 L29 13.5 L29 22 C29 26.8 25.2 30.8 20 32 C14.8 30.8 11 26.8 11 22 L11 13.5 Z"
        fill="url(#shieldGrad)"
        opacity="0.95"
      />

      {/* Lock body */}
      <rect x="16" y="21" width="8" height="6" rx="1.5" fill="#0f172a" opacity="0.85" />

      {/* Lock shackle */}
      <path
        d="M17.5 21 L17.5 18.5 C17.5 16.6 22.5 16.6 22.5 18.5 L22.5 21"
        stroke="#34d399"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Keyhole */}
      <circle cx="20" cy="24" r="1.2" fill="#34d399" />
      <rect x="19.4" y="24.5" width="1.2" height="1.8" rx="0.3" fill="#34d399" />

      {/* Chain node left */}
      <circle cx="6.5" cy="20" r="2.5" fill="none" stroke="url(#chainGrad)" strokeWidth="1.5" />

      {/* Chain node right */}
      <circle cx="33.5" cy="20" r="2.5" fill="none" stroke="url(#chainGrad)" strokeWidth="1.5" />

      {/* Defs */}
      <defs>
        <linearGradient id="ecGrad" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="11" y1="9" x2="29" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#0f3460" />
        </linearGradient>
        <linearGradient id="chainGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ─── AMN Token Logo ──────────────────────────────────────────────────────────
interface AMNLogoProps {
  size?: number;
  className?: string;
}

export const AMNTokenLogo: React.FC<AMNLogoProps> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AMN Token Logo"
    >
      {/* Outer coin circle */}
      <circle cx="16" cy="16" r="15" fill="url(#amnCoinGrad)" />
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="url(#amnRingGrad)" strokeWidth="0.8" opacity="0.6" />

      {/* Inner emblem background */}
      <circle cx="16" cy="16" r="11" fill="url(#amnInnerGrad)" />

      {/* Letter A stylized as upward arrow / triangle token mark */}
      <path
        d="M16 6.5 L22.5 20.5 L19.5 20.5 L18 17.5 L14 17.5 L12.5 20.5 L9.5 20.5 Z"
        fill="url(#amnTextGrad)"
      />
      {/* Cross bar of A */}
      <rect x="13" y="15.2" width="6" height="1.5" rx="0.5" fill="url(#amnTextGrad)" />

      {/* Spark dots (AMN utility glow) */}
      <circle cx="7" cy="10" r="1" fill="#fbbf24" opacity="0.7" />
      <circle cx="25" cy="10" r="1" fill="#fbbf24" opacity="0.7" />
      <circle cx="16" cy="28.5" r="1" fill="#fbbf24" opacity="0.5" />

      <defs>
        <radialGradient id="amnCoinGrad" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="60%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
        <linearGradient id="amnRingGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="amnInnerGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#3b1c05" />
        </radialGradient>
        <linearGradient id="amnTextGrad" x1="9.5" y1="6.5" x2="22.5" y2="20.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ─── EscrowChain Brand Mark (horizontal text + icon) ────────────────────────
export const EscrowChainBrand: React.FC<{ iconSize?: number; className?: string; textClass?: string }> = ({
  iconSize = 28,
  className = '',
  textClass = '',
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <EscrowChainLogo size={iconSize} />
    <span className={`font-extrabold tracking-tight text-white ${textClass}`}>
      EscrowChain
    </span>
  </div>
);
