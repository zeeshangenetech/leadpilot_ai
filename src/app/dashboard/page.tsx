'use client';
import { useState, useEffect } from 'react';
import type { Lead } from '@/lib/types';
import { getLeads } from '@/lib/leads-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadsByCategoryChart } from './_components/leads-by-category-chart';
import { LeadsBySourceChart } from './_components/leads-by-source-chart';
import { Users, Mail, BarChart3, LineChart } from 'lucide-react';
import { getStats } from '@/lib/stats-service';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messagesSent, setMessagesSent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLeads(getLeads());
    setMessagesSent(getStats().messagesSent);
    setIsLoading(false);
  }, []);

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.scoreCategory === 'Hot').length;

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }
  
  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">All captured leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotLeads}</div>
             <p className="text-xs text-muted-foreground">
              {totalLeads > 0 ? `${((hotLeads / totalLeads) * 100).toFixed(1)}% of total leads` : 'No leads yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messagesSent}</div>
            <p className="text-xs text-muted-foreground">Outreach emails sent</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-muted-foreground" />
              <span>Leads by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsByCategoryChart leads={leads} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <span>Leads by Source</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsBySourceChart leads={leads} />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
