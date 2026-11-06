export function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={className}>
      <rect x="4" y="4" width="56" height="56" rx="14" fill="#c8ff00" />
      <polyline
        points="14,20 23,46 32,28 41,46 50,20"
        stroke="#0b0b0b"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo />
      <span className="text-lg font-bold tracking-tight">
        Agent<span className="text-lime">We</span>
      </span>
    </div>
  );
}
