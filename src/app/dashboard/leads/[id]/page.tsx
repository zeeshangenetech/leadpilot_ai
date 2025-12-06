
'use client';
import { useState, useEffect } from 'react';
import { getLeadById } from '@/lib/leads-service';
import type { Lead } from '@/lib/types';
import { notFound } from 'next/navigation';
import LeadHeader from './_components/lead-header';
import LeadInfoCard from './_components/lead-info-card';
import ScoreCard from './_components/score-card';
// import UpsellCard from './_components/upsell-card';
import MessageGenerator from './_components/message-generator';
import ActivityFeed from './_components/activity-feed';
import { Separator } from '@/components/ui/separator';
import TagsCard from './_components/tags-card';

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);

  useEffect(() => {
    const foundLead = getLeadById(params.id);
    setLead(foundLead);
  }, [params.id]);

  if (lead === undefined) {
    return <div>Loading...</div>;
  }
  
  if (!lead) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <LeadHeader lead={lead} />
      <Separator />
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <LeadInfoCard lead={lead} />
          <ActivityFeed lead={lead} />
        </div>
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ScoreCard lead={lead} />
            <TagsCard lead={lead} />
            {/* <UpsellCard lead={lead} /> */}
          </div>
          <MessageGenerator lead={lead} />
        </div>
      </div>
    </div>
  );
}
