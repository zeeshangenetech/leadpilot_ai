import type { Lead } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mic, MessageSquare, MousePointerClick } from 'lucide-react';
import { format } from 'date-fns';

const activities = [
    { icon: <FileText className="h-4 w-4" />, text: 'Downloaded "Advanced Analytics" whitepaper', date: new Date(2024, 6, 20) },
    { icon: <Mic className="h-4 w-4" />, text: 'Attended "Future of Work" webinar', date: new Date(2024, 6, 15) },
    { icon: <MessageSquare className="h-4 w-4" />, text: 'Responded to email campaign', date: new Date(2024, 6, 12) },
    { icon: <MousePointerClick className="h-4 w-4" />, text: 'Visited pricing page', date: new Date(2024, 6, 10) },
]

export default function ActivityFeed({ lead }: { lead: Lead }) {
    // In a real app, this would be dynamic based on the lead
  return (
    <Card>
        <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {activities.map((activity, index) => (
                    <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                <div className="text-muted-foreground">{activity.icon}</div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{activity.text}</p>
                            <p className="text-xs text-muted-foreground">{format(activity.date, 'MMM d, yyyy')}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
  );
}
