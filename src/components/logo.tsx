export function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Anvil / forge shape */}
      <rect x="6" y="20" width="20" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="10" y="16" width="12" height="5" rx="1" fill="currentColor" opacity="0.5" />
      {/* Code brackets */}
      <path
        d="M12 6L8 12L12 18"
        stroke="#c8ff00"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 6L24 12L20 18"
        stroke="#c8ff00"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spark / flame */}
      <circle cx="16" cy="10" r="2" fill="#c8ff00">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="16" cy="10" r="4" fill="#c8ff00" opacity="0.15">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo />
      <span className="text-lg font-bold tracking-tight">
        Codeforge<span className="text-lime"> AI</span>
      </span>
    </div>
  );
}
