'use client';
import * as React from 'react';
import type { Lead } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  ArrowUp,
  ArrowDown,
  Linkedin,
  Facebook,
  Briefcase,
  Mail,
  Flame,
  Sun,
  Snowflake,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type SortConfig = {
  key: keyof Lead | null;
  direction: 'ascending' | 'descending';
};

const sourceIcons = {
  LinkedIn: <Linkedin className="h-4 w-4 text-blue-600" />,
  Upwork: <Briefcase className="h-4 w-4 text-green-600" />,
  Facebook: <Facebook className="h-4 w-4 text-blue-800" />,
  Email: <Mail className="h-4 w-4 text-gray-500" />,
};

const scoreCategoryColors: Record<Lead['scoreCategory'], string> = {
  Hot: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
  Warm: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
  Cold: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
};

const ScoreBadge: React.FC<{ category: Lead['scoreCategory'] }> = ({ category }) => {
  const icons = {
    Hot: <Flame className="h-3 w-3" />,
    Warm: <Sun className="h-3 w-3" />,
    Cold: <Snowflake className="h-3 w-3" />,
  };
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 ${scoreCategoryColors[category]}`}
    >
      {icons[category]}
      {category}
    </Badge>
  );
};


export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: 'lastActivity',
    direction: 'descending',
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sourceFilter, setSourceFilter] = React.useState('all');

  const requestSort = (key: keyof Lead) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredLeads = React.useMemo(() => {
    let sortableItems = [...leads];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      return matchesSearch && matchesSource;
    });
  }, [leads, sortConfig, searchTerm, sourceFilter]);

  const SortableHeader = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: keyof Lead;
  }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => requestSort(sortKey)} className="-ml-4">
        {label}
        {sortConfig.key === sortKey &&
          (sortConfig.direction === 'ascending' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    </TableHead>
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-4 border-b">
          <Input
            placeholder="Filter by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="Upwork">Upwork</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <SortableHeader label="Score" sortKey="score" />
                <SortableHeader label="Category" sortKey="scoreCategory" />
                <SortableHeader label="Source" sortKey="source" />
                <TableHead>Tags</TableHead>
                <SortableHeader label="Last Activity" sortKey="lastActivity" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={lead.avatar} data-ai-hint="person" />
                        <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.company}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{lead.score}</div>
                  </TableCell>
                  <TableCell>
                     <ScoreBadge category={lead.scoreCategory} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {sourceIcons[lead.source]}
                      {lead.source}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(lead.lastActivity, { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
