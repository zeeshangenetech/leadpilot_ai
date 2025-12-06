import type { Lead } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Briefcase, Globe, Linkedin, Facebook } from 'lucide-react';

const sourceIcons = {
  LinkedIn: <Linkedin className="h-4 w-4 text-muted-foreground" />,
  Upwork: <Briefcase className="h-4 w-4 text-muted-foreground" />,
  Facebook: <Facebook className="h-4 w-4 text-muted-foreground" />,
  Email: <Mail className="h-4 w-4 text-muted-foreground" />,
};

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value?: string; href?: string }) {
  if (!value) return null;
  
  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
      {value}
    </a>
  ) : (
    <span className="truncate">{value}</span>
  );

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="text-sm font-medium">{content}</div>
      </div>
    </div>
  );
}

export default function LeadInfoCard({ lead }: { lead: Lead }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <InfoRow icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email" value={lead.email} href={`mailto:${lead.email}`} />
        <InfoRow icon={sourceIcons[lead.source]} label="Source" value={lead.source} />
        {lead.website && <InfoRow icon={<Globe className="h-4 w-4 text-muted-foreground" />} label="Website" value={lead.website} href={lead.website} />}
        {lead.linkedinProfile && <InfoRow icon={<Linkedin className="h-4 w-4 text-muted-foreground" />} label="LinkedIn" value="View Profile" href={lead.linkedinProfile} />}
      </CardContent>
    </Card>
  );
}
