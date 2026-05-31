"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function PerformanceChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (num) => {
    if (!num) return "₹0";
    const parsedNum = Number(num);
    if (isNaN(parsedNum)) return "₹0";
    if (parsedNum >= 10000000) return `₹${(parsedNum / 10000000).toFixed(2)} Cr`;
    if (parsedNum >= 100000) return `₹${(parsedNum / 100000).toFixed(2)} L`;
    return `₹${parsedNum.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-navy p-3 rounded-xl border border-brand-border shadow-brand text-xs text-white">
          <p className="font-bold mb-1 m-0">{payload[0].payload.year}</p>
          <p className="font-extrabold text-brand-tealLight m-0">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-[10px] text-brand-slateLight mt-0.5 m-0">
            {payload[0].payload.label || "Estimated Value"}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <div className="w-full h-[220px] sm:h-[260px] bg-brand-bgCard rounded-xl border border-brand-border flex items-center justify-center text-xs text-brand-slate">
        Loading performance chart...
      </div>
    );
  }

  // Find min and max for Y-Axis padding
  const values = data.map((d) => d.value);
  const minVal = Math.min(...values) * 0.95;
  const maxVal = Math.max(...values) * 1.05;

  return (
    <div className="w-full h-[220px] sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 12, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
          <XAxis
            dataKey="year"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={8}
            className="font-semibold text-brand-slate"
          />
          <YAxis
            domain={[minVal, maxVal]}
            stroke="#94A3B8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => {
              if (val >= 10000000) {
                const cr = val / 10000000;
                return `${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)} Cr`;
              }
              if (val >= 100000) {
                const l = val / 100000;
                return `${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)} L`;
              }
              return val.toLocaleString();
            }}
            dx={-4}
            className="font-semibold text-brand-slate"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0D9488"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            dot={{ r: 4, stroke: "#0D9488", strokeWidth: 2, fill: "#FFFFFF" }}
            activeDot={{ r: 6, stroke: "#0D9488", strokeWidth: 2, fill: "#0D9488" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
