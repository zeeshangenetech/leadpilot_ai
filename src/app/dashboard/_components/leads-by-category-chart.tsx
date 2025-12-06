'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function LeadsByCategoryChart({ leads }: { leads: Lead[] }) {
  const data = React.useMemo(() => {
    const counts = leads.reduce(
      (acc, lead) => {
        acc[lead.scoreCategory] = (acc[lead.scoreCategory] || 0) + 1;
        return acc;
      },
      {} as Record<Lead['scoreCategory'], number>
    );

    return [
        { name: 'Hot', value: counts.Hot || 0, color: 'hsl(var(--destructive))' },
        { name: 'Warm', value: counts.Warm || 0, color: 'hsl(var(--primary))' },
        { name: 'Cold', value: counts.Cold || 0, color: 'hsl(var(--muted-foreground))' },
    ].filter(d => d.value > 0);
  }, [leads]);
  
  if (leads.length === 0) {
      return (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No lead data to display.
          </div>
      )
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
}
