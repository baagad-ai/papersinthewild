/**
 * SealMark — the PITW ink seal.
 * Circular oxblood ring with "PITW" mono text inside.
 * Used as favicon, footer mark, IG highlight cover, OG corner.
 */
export function SealMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Papers in the Wild seal"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-oxblood"
      />
      <circle
        cx="32"
        cy="6"
        r="1.5"
        className="text-oxblood"
        fill="currentColor"
      />
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="13"
        fontWeight="500"
        letterSpacing="1"
        className="text-oxblood"
        fill="currentColor"
      >
        PITW
      </text>
      <text
        x="32"
        y="48"
        textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace"
        fontSize="6"
        letterSpacing="2"
        className="text-oxblood"
        fill="currentColor"
        opacity="0.7"
      >
        IN THE WILD
      </text>
    </svg>
  );
}
