import { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';

interface ScanLineRevealProps {
  accent: string;
  onComplete: () => void;
  children: React.ReactNode;
}

export function ScanLineReveal({ accent, onComplete, children }: ScanLineRevealProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const updateSectionOpacity = useCallback((pct: number) => {
    const container = containerRef.current;
    if (!container) return;
    const containerHeight = container.offsetHeight;
    if (containerHeight === 0) return;
    const scanLinePx = pct * containerHeight;
    const containerRect = container.getBoundingClientRect();
    const sections = container.querySelectorAll<HTMLElement>('[data-scan-section]');
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top - containerRect.top;
      const sectionBottom = sectionTop + rect.height;
      let opacity: number;
      if (sectionBottom <= scanLinePx) {
        opacity = 1;
      } else if (sectionTop >= scanLinePx) {
        opacity = 0.35;
      } else {
        const fraction = (scanLinePx - sectionTop) / rect.height;
        opacity = 0.35 + 0.65 * fraction;
      }
      section.style.opacity = String(opacity);
    });
  }, []);

  useLayoutEffect(() => {
    if (done) return;
    const container = containerRef.current;
    if (!container) return;
    container.querySelectorAll<HTMLElement>('[data-scan-section]').forEach((s) => {
      s.style.opacity = '0.35';
    });
  }, [done]);

  useEffect(() => {
    if (done) {
      const container = containerRef.current;
      if (!container) return;
      container.querySelectorAll<HTMLElement>('[data-scan-section]').forEach((s) => {
        s.style.opacity = '1';
      });
      return;
    }

    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      updateSectionOpacity(pct);
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
        setTimeout(onComplete, 300);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete, done, updateSectionOpacity]);

  const lineTop = progress * 100;

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Content — sections get opacity applied directly via data-scan-section */}
      <div>{children}</div>

      {/* Scan line with glow */}
      {!done && (
        <div
          className="absolute left-0 right-0 pointer-events-none z-20"
          style={{
            top: `${lineTop}%`,
            height: '2px',
            background: accent,
            boxShadow: `0 0 20px 4px ${accent}80, 0 0 40px 8px ${accent}40`,
          }}
        />
      )}

      {/* Reading state label — top-level layer, highest z-index, anchored to right edge outside text column */}
      {!done && (
        <div
          className="absolute right-2 pointer-events-none z-50"
          style={{ top: `calc(${lineTop}% + 6px)` }}
        >
          <span
            className="font-mono text-xs px-2 py-1 rounded whitespace-nowrap"
            style={{
              color: accent,
              background: '#0a0a0a',
              letterSpacing: '0.05em',
            }}
          >
            READING STATE... {Math.round(progress * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
