"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/utils";

export function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" fontSize={12} stroke="var(--muted-foreground)" />
        <YAxis
          fontSize={12}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => formatCurrency(v)}
          width={90}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            borderRadius: "0.75rem",
            border: "1px solid var(--border)",
            backgroundColor: "var(--popover)",
          }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="var(--primary)"
          fill="url(#salesColor)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
