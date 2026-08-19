export default function Logo({ size = "default" }: { size?: "default" | "large" | "footer" }) {
  const isLarge = size === "large";
  const isFooter = size === "footer";

  // Height of the 3D logo graphic based on size (increased for prominent luxury look)
  const imgHeight = isLarge 
    ? "h-[95px] sm:h-[110px]" 
    : isFooter 
      ? "h-[68px] sm:h-[78px]" 
      : "h-[58px] sm:h-[66px]";

  const mistScale = isLarge ? "scale-125" : isFooter ? "scale-110" : "scale-100";

  return (
    <div className="group relative inline-flex flex-col items-center select-none cursor-pointer">
      {/* Inline styles for keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes logoMistPulse {
          0%, 100% { opacity: 0.35; transform: scale(0.95) translate(0, 0); }
          50% { opacity: 0.85; transform: scale(1.15) translate(4px, -3px); filter: drop-shadow(0 0 8px rgba(234, 190, 110, 0.9)); }
        }

        @keyframes logoShimmerSweep {
          0% { transform: translateX(-120%) skewX(-20deg); }
          50%, 100% { transform: translateX(180%) skewX(-20deg); }
        }

        @keyframes logoGlowPulse {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(212, 169, 90, 0.3)); }
          50% { filter: drop-shadow(0 0 14px rgba(212, 169, 90, 0.85)) drop-shadow(0 0 22px rgba(184, 139, 60, 0.45)); }
        }

        @keyframes sparkFloat {
          0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
          50% { opacity: 1; transform: translate(12px, -8px) scale(1.2); }
          100% { opacity: 0; transform: translate(24px, -16px) scale(0.4); }
        }
      `}} />

      {/* Container for logo image + spray mist animation */}
      <div className="relative flex items-center justify-center">
        {/* Animated Spray Mist Effect overlay on nozzle (top right of bottle) */}
        <div 
          className={`absolute top-[6%] right-[14%] pointer-events-none z-10 ${mistScale}`}
          style={{ animation: 'logoMistPulse 2.8s ease-in-out infinite' }}
        >
          <svg width="38" height="26" viewBox="0 0 34 24" fill="none">
            <path d="M2 18 C 10 14, 18 10, 30 2" stroke="url(#mistGrad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
            <path d="M4 22 C 12 16, 20 12, 32 6" stroke="url(#mistGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <path d="M2 14 C 8 12, 14 8, 26 2" stroke="url(#mistGrad)" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
            {/* Spray sparkles */}
            <circle cx="28" cy="4" r="1.5" fill="#fce4ad" style={{ animation: 'sparkFloat 2s ease-in-out infinite' }} />
            <circle cx="20" cy="9" r="1.2" fill="#ffd778" style={{ animation: 'sparkFloat 2s ease-in-out infinite 0.6s' }} />
            <circle cx="32" cy="8" r="1.8" fill="#ffffff" style={{ animation: 'sparkFloat 2s ease-in-out infinite 1.2s' }} />
            <defs>
              <linearGradient id="mistGrad" x1="0" y1="20" x2="34" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d4a95a" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#f7d488" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 3D Reference Brand Logo Image */}
        <div className="relative overflow-hidden group-hover:scale-[1.04] transition-transform duration-500">
          <img 
            src="/images/huda_essence_logo.png" 
            alt="Huda Essence - Perfume House Logo" 
            className={`w-auto ${imgHeight} object-contain block`}
            style={{
              animation: 'logoGlowPulse 3.5s ease-in-out infinite',
            }}
          />

          {/* Shimmer Light Beam sweep effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div 
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent transform -skew-x-12"
              style={{ animation: 'logoShimmerSweep 4s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>

      {/* Tagline: PERFUME HOUSE */}
      <div className="mt-1 flex items-center justify-center gap-2">
        <span className={`h-px w-5 sm:w-6 ${isFooter ? 'bg-[#b48a3c]/60' : 'bg-[#a37628]/50'}`}></span>
        <span 
          className={`uppercase font-[600] tracking-[0.28em] ${
            isLarge 
              ? 'text-[12.5px] sm:text-[14px]' 
              : isFooter 
                ? 'text-[11px] text-[#e5c382]' 
                : 'text-[10.5px] sm:text-[11.5px] text-[#a06e24]'
          }`}
          style={{
            fontFamily: "'Instrument Sans', 'Inter', sans-serif",
            textShadow: isFooter ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 1px rgba(255,255,255,0.7)',
            letterSpacing: '0.28em'
          }}
        >
          PERFUME HOUSE
        </span>
        <span className={`h-px w-5 sm:w-6 ${isFooter ? 'bg-[#b48a3c]/60' : 'bg-[#a37628]/50'}`}></span>
      </div>
    </div>
  );
}
