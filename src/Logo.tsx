export default function Logo({ size = "default" }: { size?: "default" | "large" | "footer" }) {
  const isLarge = size === "large";
  const isFooter = size === "footer";
  const textColor = isFooter ? "#f6e8cc" : "#1b1310";
  const goldColor = isFooter ? "#d4a95a" : "#b48a3c";

  return (
    <div className="inline-flex items-center gap-[10px]">
      {/* Monogram HE */}
      <svg
        width={isLarge ? 48 : 38}
        height={isLarge ? 48 : 38}
        viewBox="0 0 80 80"
        fill="none"
      >
        {/* Outer octagon */}
        <path
          d="M26.5 4 L53.5 4 L72 16.5 L76 40 L72 63.5 L53.5 76 L26.5 76 L8 63.5 L4 40 L8 16.5 Z"
          stroke={goldColor}
          strokeWidth="1.6"
          fill="none"
        />
        {/* H */}
        <text
          x="25"
          y="52"
          fill={textColor}
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "36px",
            fontWeight: 600,
          }}
        >
          H
        </text>
        {/* E - overlapping */}
        <text
          x="42"
          y="52"
          fill={goldColor}
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "36px",
            fontWeight: 600,
          }}
        >
          E
        </text>
        {/* small diamond */}
        <path d="M40 64 L43 67 L40 70 L37 67 Z" fill={goldColor} opacity="0.6" />
      </svg>

      {/* Brand text */}
      <div>
        <div
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: isLarge ? "30px" : "24px",
            fontWeight: 600,
            color: textColor,
            letterSpacing: "0.06em",
            lineHeight: 1,
            whiteSpace: "nowrap" as const,
          }}
        >
          HUDA ESSENCE
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "6px",
          }}
        >
          <svg width={isLarge ? "130" : "100"} height="14" viewBox="0 0 80 12" fill="none">
            {/* Left line */}
            <path d="M 2 6 L 32 6" stroke={goldColor} strokeWidth="0.8" opacity="0.7" />
            {/* Center Flourish Ornament */}
            <path d="M 40 1 C 40.5 3, 42 4, 40 6 C 38 4, 39.5 3, 40 1 Z" fill={goldColor} />
            <path d="M 40 11 C 40.5 9, 42 8, 40 6 C 38 8, 39.5 9, 40 11 Z" fill={goldColor} />
            <path d="M 37 6 C 35 6.5, 34 8, 32 6 C 34 4, 35 5.5, 37 6 Z" fill={goldColor} />
            <path d="M 43 6 C 45 6.5, 46 8, 48 6 C 46 4, 45 5.5, 43 6 Z" fill={goldColor} />
            <circle cx="35" cy="6" r="1" fill={goldColor} />
            <circle cx="45" cy="6" r="1" fill={goldColor} />
            <circle cx="40" cy="6" r="1.6" fill={goldColor} />
            {/* Right line */}
            <path d="M 48 6 L 78 6" stroke={goldColor} strokeWidth="0.8" opacity="0.7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
