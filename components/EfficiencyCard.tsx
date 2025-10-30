"use client";

import { useMemo } from "react";

type EfficiencyCardProps = {
  inStockPercentage: number;
  lowStockPercentage: number;
  outOfStockPercentage: number;
};

function buildClipPath(percent: number) {
  // clamp to [0, 100]
  const clamped = Math.max(0, Math.min(percent, 100));

  // how smooth the arc should look (more steps = smoother curve)
  const steps = Math.max(1, Math.round((clamped / 100) * 60));

  // we'll start drawing from the top (12 o'clock = -90deg)
  const startDeg = -90;
  const endDeg = startDeg + (clamped / 100) * 360;

  // polygon points: first the center of the circle
  const points: string[] = ["50% 50%"];

  // then points along the arc from startDeg → endDeg
  for (let i = 0; i <= steps; i++) {
    const t = startDeg + ((endDeg - startDeg) * i) / steps;
    const rad = (t * Math.PI) / 180;

    // circle radius is basically 50% of the box (because we use inset-0)
    const x = 50 + 50 * Math.cos(rad);
    const y = 50 + 50 * Math.sin(rad);

    points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }

  return `polygon(${points.join(",")})`;
}

export default function EfficiencyCard({
  inStockPercentage,
  lowStockPercentage,
  outOfStockPercentage,
}: EfficiencyCardProps) {
  // memo so we don't rebuild clipPath every render unless % changes
  const clipPath = useMemo(
    () => buildClipPath(inStockPercentage),
    [inStockPercentage]
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Efficiency</h2>
      </div>

      {/* Radial gauge */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Full grey ring (background track) */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-200" />

          {/* Purple progress wedge (clipped by % we calculated) */}
          <div
            className="absolute inset-0 rounded-full border-8 border-purple-600"
            style={{ clipPath }}
          />

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {inStockPercentage}%
              </div>
              <div className="text-sm text-gray-600">In Stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full  bg-purple-600" />
            <span>In Stock ({inStockPercentage}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-200" />
            <span>Low Stock ({lowStockPercentage}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <span>Out of Stock ({outOfStockPercentage}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
