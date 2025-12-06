
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tags } from 'lucide-react';

export default function TagsCard({ lead }: { lead: Lead }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-muted-foreground" />
          <span>Tags</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lead.tags && lead.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {lead.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tags available.</p>
        )}
      </CardContent>
    </Card>
  );
}
