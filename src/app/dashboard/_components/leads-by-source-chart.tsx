'use client';

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LeadsBySourceChart({ leads }: { leads: Lead[] }) {
  const data = React.useMemo(() => {
    const counts = leads.reduce(
      (acc, lead) => {
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
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                />
                <Legend />
                <Bar dataKey="leads" fill="hsl(var(--primary))" barSize={30} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
