'use client';

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LeadsBySourceChart({ leads }: { leads: Lead[] }) {
  const data = React.useMemo(() => {
    const counts = leads.reduce(
      (acc, lead) => {
        // Use a safe type assertion for `acc` initialization
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
      },
      {} as Record<Lead['source'], number>
    );

    return Object.entries(counts).map(([name, value]) => ({ name, leads: value }));
  }, [leads]);

  if (leads.length === 0) {
      return (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No lead data to display.
          </div>
      )
  }

  return (
    // **Modification 1: Add border radius to the container**
    // Assuming you are using Tailwind/Shadcn utility classes, 'rounded-xl' is a common choice.
    <div style={{ width: '100%', height: 300 }} className="rounded-xl overflow-hidden border"> 
        <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                {/* **Modification 2: Define the Gradient** */}
                <defs>
                    <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                        {/* Define the gradient stops based on the requested colors */}
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#8982FF" />
                    </linearGradient>
                </defs>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem' // Optional: Adds border radius to the tooltip
                    }}
                />
                <Legend />
                {/* **Modification 3: Use the gradient URL as the fill** */}
                <Bar 
                    dataKey="leads" 
                    fill="url(#gradientBar)" // Referencing the gradient by its ID
                    barSize={30} 
                    // Optional: Add a slight border radius to the bars themselves for a softer look
                    radius={[0, 4, 4, 0]} 
                />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}