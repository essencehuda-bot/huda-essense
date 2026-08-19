export default function Logo({ size = "default", className = "" }: { size?: "default" | "large" | "footer", className?: string }) {
  const isLarge = size === "large";
  const isFooter = size === "footer";

  // Height and max-width tailored for header, drawer, and footer layouts
  const heightClass = isLarge 
    ? "h-[64px] sm:h-[76px]" 
    : isFooter 
      ? "h-[54px] sm:h-[62px]" 
      : "h-[42px] sm:h-[48px]";

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <img
        src="/images/huda_essence_logo.png"
        alt="HUDA ESSENCE"
        className={`${heightClass} w-auto object-contain transition-transform duration-300 hover:scale-[1.03] drop-shadow-[0_2px_10px_rgba(212,169,90,0.25)]`}
        loading="eager"
      />
    </div>
  );
}
