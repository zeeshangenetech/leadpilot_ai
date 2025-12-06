import type { Lead } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Sun, Snowflake } from 'lucide-react';

const scoreCategoryStyles: Record<
  Lead['scoreCategory'],
  {
    icon: React.ReactNode;
    badgeClass: string;
    progressClass: string;
    textColor: string;
  }
> = {
  Hot: {
    icon: <Flame className="h-5 w-5" />,
    badgeClass: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
    progressClass: 'bg-red-500',
    textColor: 'text-red-500',
  },
  Warm: {
    icon: <Sun className="h-5 w-5" />,
    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
    progressClass: 'bg-yellow-500',
    textColor: 'text-yellow-500',
  },
  Cold: {
    icon: <Snowflake className="h-5 w-5" />,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
    progressClass: 'bg-blue-500',
    textColor: 'text-blue-500',
  },
};

export default function ScoreCard({ lead }: { lead: Lead }) {
  const styles = scoreCategoryStyles[lead.scoreCategory];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Lead Score</span>
          <Badge variant="outline" className={`flex items-center gap-1.5 ${styles.badgeClass}`}>
            {styles.icon}
            {lead.scoreCategory}
          </Badge>
        </CardTitle>
        <CardDescription>Based on engagement and profile data</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className={`text-4xl font-bold ${styles.textColor}`}>{lead.score}</div>
          <Progress value={lead.score} className="flex-1" indicatorClassName={styles.progressClass} />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Explanation</h4>
          <p className="text-sm text-muted-foreground">{lead.scoreExplanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Add indicatorClassName to Progress component props for custom coloring
declare module "react" {
    interface ComponentPropsWithoutRef<T extends React.ElementType> {
        indicatorClassName?: string;
    }
}
