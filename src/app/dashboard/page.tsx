
'use client';
import { useState, useEffect } from 'react';
import { getLeads } from '@/lib/leads-service';
import type { Lead } from '@/lib/types';
import LeadsTable from './_components/leads-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileDown } from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLeads(getLeads());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading leads...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/upload">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Lead
            </Link>
          </Button>
        </div>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
