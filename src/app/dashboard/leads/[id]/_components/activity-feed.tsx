import type { Lead } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeed({ lead }: { lead: Lead }) {
    
  return (
    <Card>
        <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                <li className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            <div className="text-muted-foreground"><FileText className="h-4 w-4" /></div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{lead.recentActivity}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(lead.lastActivity, { addSuffix: true })}</p>
                    </div>
                </li>
            </ul>
        </CardContent>
    </Card>
  );
}
