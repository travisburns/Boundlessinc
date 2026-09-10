"use client";

import { useState } from "react";
import type { RevenuePoint } from "@/features/intelligence/types/intelligence.types";
import { formatMoney } from "@/lib/formatting/money";

/**
 * 14-day portfolio revenue — a single-series magnitude-over-time bar chart.
 * One series, so the title names it (no legend); identity of each bar is its
 * date, carried on hover. Gold marks on the dark surface; thin bars, rounded
 * data-ends anchored to the baseline, recessive axis.
 */
export function RevenueTrendChart({ points }: { points: RevenuePoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 720;
  const H = 220;
  const padX = 12;
  const padTop = 16;
  const padBottom = 28;
  const max = Math.max(1, ...points.map((p) => p.revenue));
  const n = points.length;
  const slot = (W - padX * 2) / n;
  const barW = Math.min(28, slot * 0.6);
  const plotH = H - padTop - padBottom;

  function x(i: number) {
    return padX + slot * i + (slot - barW) / 2;
  }
  function barHeight(v: number) {
    return Math.max(2, (v / max) * plotH);
  }

  const fmtDay = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Portfolio revenue over the last 14 days"
      >
        {/* baseline */}
        <line
          x1={padX}
          x2={W - padX}
          y1={padTop + plotH}
          y2={padTop + plotH}
          stroke="var(--color-line)"
          strokeWidth={1}
        />
        {points.map((p, i) => {
          const h = barHeight(p.revenue);
          const active = hover === i;
          return (
            <g key={p.date}>
              <rect
                x={x(i)}
                y={padTop + plotH - h}
                width={barW}
                height={h}
                rx={4}
                fill="var(--color-gold)"
                opacity={hover === null || active ? 1 : 0.45}
              />
              {/* wide invisible hit target */}
              <rect
                x={padX + slot * i}
                y={padTop}
                width={slot}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <title>
                  {fmtDay(p.date)}: {formatMoney(p.revenue)}
                </title>
              </rect>
              {(i === 0 || i === n - 1) && (
                <text
                  x={x(i) + barW / 2}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill="var(--color-text-faint)"
                >
                  {fmtDay(p.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-1.5 text-xs text-[var(--color-text)] shadow-[var(--shadow-elev)]">
          <span className="text-[var(--color-text-faint)]">{fmtDay(points[hover].date)}</span>{" "}
          · {formatMoney(points[hover].revenue)}
        </div>
      )}
    </div>
  );
}
