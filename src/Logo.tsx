export default function Logo({ size = "default", className = "" }: { size?: "default" | "large" | "footer", className?: string }) {
  const isLarge = size === "large";
  const isFooter = size === "footer";

  // Prominent sizing tailored for luxury brand identity
  const heightClass = isLarge 
    ? "h-[90px] sm:h-[115px]" 
    : isFooter 
      ? "h-[75px] sm:h-[92px]" 
      : "h-[58px] sm:h-[68px] md:h-[74px]";

  return (
    <div className={`inline-flex items-center justify-center select-none py-1 ${className}`}>
      <img
        src="/images/huda_essence_logo.png"
        alt="HUDA ESSENCE"
        className={`${heightClass} w-auto max-w-[280px] object-contain transition-transform duration-300 hover:scale-[1.04] drop-shadow-[0_2px_12px_rgba(212,169,90,0.3)]`}
        loading="eager"
      />
    </div>
  );
}
