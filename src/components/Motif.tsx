import type { MoodCategory } from '@/types';

interface MotifProps {
  category: MoodCategory;
  color: string;
  className?: string;
}

export function Motif({ category, color, className }: MotifProps) {
  const stroke = color;
  const sw = 1.5;

  switch (category) {
    case 'property':
      return <BlueprintMotif color={stroke} strokeWidth={sw} className={className} />;
    case 'employment':
      return <OrgChartMotif color={stroke} strokeWidth={sw} className={className} />;
    case 'court':
      return <SealMotif color={stroke} strokeWidth={sw} className={className} />;
    case 'financial':
      return <LedgerMotif color={stroke} strokeWidth={sw} className={className} />;
    case 'estate':
      return <ScrollMotif color={stroke} strokeWidth={sw} className={className} />;
    case 'general':
      return null;
    default:
      return null;
  }
}

function BlueprintMotif({ color, strokeWidth, className }: { color: string; strokeWidth: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer wall */}
      <rect x="40" y="40" width="320" height="320" stroke={color} strokeWidth={strokeWidth} />
      {/* Interior walls — floor plan layout */}
      <line x1="40" y1="160" x2="200" y2="160" stroke={color} strokeWidth={strokeWidth} />
      <line x1="200" y1="40" x2="200" y2="160" stroke={color} strokeWidth={strokeWidth} />
      <line x1="200" y1="160" x2="200" y2="360" stroke={color} strokeWidth={strokeWidth} />
      <line x1="200" y1="240" x2="360" y2="240" stroke={color} strokeWidth={strokeWidth} />
      <line x1="200" y1="280" x2="360" y2="280" stroke={color} strokeWidth={strokeWidth} />
      {/* Door gaps (short double lines) */}
      <line x1="100" y1="160" x2="130" y2="160" stroke={color} strokeWidth={strokeWidth} />
      <line x1="100" y1="155" x2="100" y2="165" stroke={color} strokeWidth={strokeWidth} />
      <line x1="130" y1="155" x2="130" y2="165" stroke={color} strokeWidth={strokeWidth} />
      {/* Dimension lines */}
      <line x1="40" y1="20" x2="360" y2="20" stroke={color} strokeWidth={strokeWidth * 0.6} />
      <line x1="40" y1="15" x2="40" y2="25" stroke={color} strokeWidth={strokeWidth * 0.6} />
      <line x1="360" y1="15" x2="360" y2="25" stroke={color} strokeWidth={strokeWidth * 0.6} />
      <line x1="20" y1="40" x2="20" y2="360" stroke={color} strokeWidth={strokeWidth * 0.6} />
      <line x1="15" y1="40" x2="25" y2="40" stroke={color} strokeWidth={strokeWidth * 0.6} />
      <line x1="15" y1="360" x2="25" y2="360" stroke={color} strokeWidth={strokeWidth * 0.6} />
      {/* Stairs lines */}
      <line x1="230" y1="50" x2="230" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="240" y1="50" x2="240" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="250" y1="50" x2="250" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="260" y1="50" x2="260" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="270" y1="50" x2="270" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="280" y1="50" x2="280" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="290" y1="50" x2="290" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="300" y1="50" x2="300" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="310" y1="50" x2="310" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="320" y1="50" x2="320" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="330" y1="50" x2="330" y2="140" stroke={color} strokeWidth={strokeWidth * 0.5} />
      {/* Small circle — possible window/fixture marker */}
      <circle cx="300" cy="320" r="20" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <circle cx="300" cy="320" r="8" stroke={color} strokeWidth={strokeWidth * 0.5} />
    </svg>
  );
}

function OrgChartMotif({ color, strokeWidth, className }: { color: string; strokeWidth: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top node */}
      <rect x="170" y="30" width="60" height="40" rx="4" stroke={color} strokeWidth={strokeWidth} />
      {/* Level 2 */}
      <line x1="200" y1="70" x2="200" y2="110" stroke={color} strokeWidth={strokeWidth} />
      <line x1="80" y1="110" x2="320" y2="110" stroke={color} strokeWidth={strokeWidth} />
      <line x1="80" y1="110" x2="80" y2="140" stroke={color} strokeWidth={strokeWidth} />
      <line x1="200" y1="110" x2="200" y2="140" stroke={color} strokeWidth={strokeWidth} />
      <line x1="320" y1="110" x2="320" y2="140" stroke={color} strokeWidth={strokeWidth} />
      <rect x="50" y="140" width="60" height="40" rx="4" stroke={color} strokeWidth={strokeWidth} />
      <rect x="170" y="140" width="60" height="40" rx="4" stroke={color} strokeWidth={strokeWidth} />
      <rect x="290" y="140" width="60" height="40" rx="4" stroke={color} strokeWidth={strokeWidth} />
      {/* Level 3 from left node */}
      <line x1="80" y1="180" x2="80" y2="210" stroke={color} strokeWidth={strokeWidth} />
      <line x1="50" y1="210" x2="110" y2="210" stroke={color} strokeWidth={strokeWidth} />
      <line x1="50" y1="210" x2="50" y2="240" stroke={color} strokeWidth={strokeWidth} />
      <line x1="110" y1="210" x2="110" y2="240" stroke={color} strokeWidth={strokeWidth} />
      <rect x="25" y="240" width="50" height="35" rx="4" stroke={color} strokeWidth={strokeWidth} />
      <rect x="85" y="240" width="50" height="35" rx="4" stroke={color} strokeWidth={strokeWidth} />
      {/* Level 3 from center node */}
      <line x1="200" y1="180" x2="200" y2="210" stroke={color} strokeWidth={strokeWidth} />
      <line x1="170" y1="210" x2="230" y2="210" stroke={color} strokeWidth={strokeWidth} />
      <line x1="170" y1="210" x2="170" y2="240" stroke={color} strokeWidth={strokeWidth} />
      <line x1="230" y1="210" x2="230" y2="240" stroke={color} strokeWidth={strokeWidth} />
      <rect x="145" y="240" width="50" height="35" rx="4" stroke={color} strokeWidth={strokeWidth} />
      <rect x="205" y="240" width="50" height="35" rx="4" stroke={color} strokeWidth={strokeWidth} />
      {/* Level 3 from right node */}
      <line x1="320" y1="180" x2="320" y2="210" stroke={color} strokeWidth={strokeWidth} />
      <rect x="295" y="240" width="50" height="35" rx="4" stroke={color} strokeWidth={strokeWidth} />
      {/* Dotted connecting lines to suggest further branching */}
      <line x1="50" y1="275" x2="50" y2="310" stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="3 4" />
      <line x1="110" y1="275" x2="110" y2="310" stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="3 4" />
      <line x1="170" y1="275" x2="170" y2="310" stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="3 4" />
      <line x1="230" y1="275" x2="230" y2="310" stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="3 4" />
      <line x1="320" y1="275" x2="320" y2="310" stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="3 4" />
      {/* Small terminal dots */}
      <circle cx="50" cy="315" r="3" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <circle cx="110" cy="315" r="3" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <circle cx="170" cy="315" r="3" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <circle cx="230" cy="315" r="3" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <circle cx="320" cy="315" r="3" stroke={color} strokeWidth={strokeWidth * 0.5} />
    </svg>
  );
}

function SealMotif({ color, strokeWidth, className }: { color: string; strokeWidth: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="200" cy="200" r="150" stroke={color} strokeWidth={strokeWidth} />
      {/* Inner ring */}
      <circle cx="200" cy="200" r="120" stroke={color} strokeWidth={strokeWidth * 0.7} />
      {/* Star detail — 5-pointed star, centered at (200,200) */}
      <path
        d="M200,120 L223.51,167.64 L276.08,175.28 L238.04,212.36 L247.02,264.72 L200,240 L152.98,264.72 L161.96,212.36 L123.92,175.28 L176.49,167.64 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Small dots around inner ring */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = 200 + 135 * Math.cos(angle);
        const y = 200 + 135 * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r="2.5" stroke={color} strokeWidth={strokeWidth * 0.5} fill={color} />;
      })}
      {/* Ribbon tails at bottom */}
      <path d="M170 340 L160 380 L200 360 L240 380 L230 340" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      {/* Curved text suggestion lines */}
      <path d="M120 200 A 80 80 0 0 1 280 200" stroke={color} strokeWidth={strokeWidth * 0.6} strokeDasharray="3 3" />
<path d="M120 200 A 80 80 0 0 0 280 200" stroke={color} strokeWidth={strokeWidth * 0.6} strokeDasharray="3 3" />
    </svg>
  );
}

function LedgerMotif({ color, strokeWidth, className }: { color: string; strokeWidth: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Horizontal ledger lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1="30" y1={50 + i * 35} x2="370" y2={50 + i * 35} stroke={color} strokeWidth={strokeWidth * 0.5} />
      ))}
      {/* Vertical divider lines */}
      <line x1="120" y1="30" x2="120" y2="370" stroke={color} strokeWidth={strokeWidth * 0.5} />
      <line x1="250" y1="30" x2="250" y2="370" stroke={color} strokeWidth={strokeWidth * 0.5} />
      {/* Rising graph line */}
      <path
        d="M30 340 L80 320 L130 290 L180 260 L230 210 L280 160 L330 100 L370 60"
        stroke={color}
        strokeWidth={strokeWidth * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Graph dots at key points */}
      <circle cx="80" cy="320" r="4" stroke={color} strokeWidth={strokeWidth} fill="none" />
      <circle cx="180" cy="260" r="4" stroke={color} strokeWidth={strokeWidth} fill="none" />
      <circle cx="280" cy="160" r="4" stroke={color} strokeWidth={strokeWidth} fill="none" />
      <circle cx="370" cy="60" r="4" stroke={color} strokeWidth={strokeWidth} fill="none" />
      {/* Small upward arrow at the end */}
      <line x1="370" y1="60" x2="370" y2="40" stroke={color} strokeWidth={strokeWidth} />
      <line x1="362" y1="48" x2="370" y2="40" stroke={color} strokeWidth={strokeWidth} />
      <line x1="378" y1="48" x2="370" y2="40" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

function ScrollMotif({ color, strokeWidth, className }: { color: string; strokeWidth: number; className?: string }) {
  const curlR = 18;
  const docLeft = 60;
  const docRight = 340;
  const docTop = 80;
  const docBottom = 300;
  const sealCx = docRight - 10;
  const sealCy = docBottom + 10;
  const sealR = 42;

  const topCurlStartY = docTop + curlR;
  const bottomCurlEndY = docBottom - curlR;

  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Document/scroll body — top and bottom edges curl inward */}
      <path
        d={`M ${docLeft} ${topCurlStartY} A ${curlR} ${curlR} 0 0 1 ${docLeft + curlR} ${docTop} L ${docRight - curlR} ${docTop} A ${curlR} ${curlR} 0 0 1 ${docRight} ${topCurlStartY} L ${docRight} ${bottomCurlEndY} A ${curlR} ${curlR} 0 0 1 ${docRight - curlR} ${docBottom} L ${docLeft + curlR} ${docBottom} A ${curlR} ${curlR} 0 0 1 ${docLeft} ${bottomCurlEndY} Z`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Inner curl hint lines (top) */}
      <path
        d={`M ${docLeft} ${topCurlStartY} A ${curlR} ${curlR} 0 0 0 ${docLeft + curlR} ${docTop}`}
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        fill="none"
      />
      <path
        d={`M ${docRight} ${topCurlStartY} A ${curlR} ${curlR} 0 0 1 ${docRight - curlR} ${docTop}`}
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        fill="none"
      />
      {/* Inner curl hint lines (bottom) */}
      <path
        d={`M ${docLeft} ${bottomCurlEndY} A ${curlR} ${curlR} 0 0 1 ${docLeft + curlR} ${docBottom}`}
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        fill="none"
      />
      <path
        d={`M ${docRight} ${bottomCurlEndY} A ${curlR} ${curlR} 0 0 0 ${docRight - curlR} ${docBottom}`}
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        fill="none"
      />
      {/* Text suggestion lines inside the scroll */}
      <line x1={docLeft + 30} y1={docTop + 40} x2={docRight - 30} y2={docTop + 40} stroke={color} strokeWidth={strokeWidth * 0.4} />
      <line x1={docLeft + 30} y1={docTop + 60} x2={docRight - 60} y2={docTop + 60} stroke={color} strokeWidth={strokeWidth * 0.4} />
      <line x1={docLeft + 30} y1={docTop + 80} x2={docRight - 40} y2={docTop + 80} stroke={color} strokeWidth={strokeWidth * 0.4} />
      <line x1={docLeft + 30} y1={docTop + 100} x2={docRight - 80} y2={docTop + 100} stroke={color} strokeWidth={strokeWidth * 0.4} />
      {/* Wax seal circle overlapping bottom-right corner */}
      <circle cx={sealCx} cy={sealCy} r={sealR} stroke={color} strokeWidth={strokeWidth} />
      <circle cx={sealCx} cy={sealCy} r={sealR * 0.65} stroke={color} strokeWidth={strokeWidth * 0.5} />
      {/* Ribbon tails from seal */}
      <path d={`M ${sealCx - 12} ${sealCy + sealR - 4} L ${sealCx - 20} ${sealCy + sealR + 20} L ${sealCx} ${sealCy + sealR + 10}`} stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinejoin="round" fill="none" />
      <path d={`M ${sealCx + 12} ${sealCy + sealR - 4} L ${sealCx + 20} ${sealCy + sealR + 20} L ${sealCx} ${sealCy + sealR + 10}`} stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinejoin="round" fill="none" />
    </svg>
  );
}
