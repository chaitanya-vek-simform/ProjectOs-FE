import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "default",
  flowchart: { htmlLabels: false, useMaxWidth: true },
});

/** Monotonic counter for unique per-render DOM ids (mermaid needs a valid id). */
let renderSeq = 0;

interface MermaidDiagramProps {
  /** Raw Mermaid source (e.g. a `flowchart TD ...` definition). */
  readonly chart: string;
  readonly ariaLabel: string;
  readonly errorMessage: string;
}

/**
 * Renders a Mermaid definition to inline SVG. The output is written straight to
 * a ref (never React state) so it stays clear of the `set-state-in-effect` rule;
 * invalid definitions fall back to the raw source in a scrollable code block.
 */
function MermaidDiagram({
  chart,
  ariaLabel,
  errorMessage,
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container || !chart.trim()) return;

    renderSeq += 1;
    mermaid
      .render(`mermaid-diagram-${renderSeq}`, chart)
      .then(({ svg }) => {
        if (!cancelled && container) container.innerHTML = svg;
      })
      .catch(() => {
        if (cancelled || !container) return;
        const notice = document.createElement("p");
        notice.className = "mb-2 text-xs font-medium text-red-500";
        notice.textContent = errorMessage;
        const source = document.createElement("pre");
        source.className = "overflow-x-auto text-xs text-slate-500";
        source.textContent = chart;
        container.replaceChildren(notice, source);
      });

    return () => {
      cancelled = true;
    };
  }, [chart, errorMessage]);

  if (!chart.trim()) return null;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      className="flex justify-center overflow-x-auto rounded-xl border border-slate-200 bg-white p-4"
    />
  );
}

export { MermaidDiagram };
