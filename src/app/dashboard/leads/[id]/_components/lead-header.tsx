'use client';
import type { Lead } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Send,
  Circle,
  HelpCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { updateLead } from '@/lib/leads-service';

const statusStyles: Record<
  Lead['status'],
  {
    icon: React.ReactNode;
    className: string;
  }
> = {
  New: {
    icon: <Circle className="h-4 w-4" />,
    className:
      'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
  },
  Contacted: {
    icon: <Send className="h-4 w-4" />,
    className:
      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
  },
  Won: {
    icon: <CheckCircle className="h-4 w-4" />,
    className:
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
  },
  Lost: {
    icon: <XCircle className="h-4 w-4" />,
    className:
      'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-700',
  },
};

const StatusBadge: React.FC<{ status: Lead['status']; large?: boolean }> = ({
  status,
  large = false,
}) => {
  const style = statusStyles[status] || { icon: <HelpCircle className="h-4 w-4" />, className: '' };
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 ${style.className} ${
        large ? 'text-sm px-3 py-1' : ''
      }`}
    >
      {style.icon}
      {status}
    </Badge>
  );
};

export default function LeadHeader({
  lead,
  onStatusChange,
}: {
  lead: Lead;
  onStatusChange: (lead: Lead) => void;
}) {
  const handleStatusChange = (status: Lead['status']) => {
    const updatedLead = { ...lead, status };
    updateLead(updatedLead);
    onStatusChange(updatedLead);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={lead.avatar} data-ai-hint="person" />
          <AvatarFallback className="text-2xl">{lead.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
          <p className="text-muted-foreground">{lead.company}</p>
          <div className="mt-2">
            <StatusBadge status={lead.status} large />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">Message</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Send className="mr-2 h-4 w-4" />
                <span>Change Status</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleStatusChange('New')}>
                    <Circle className="mr-2 h-4 w-4 text-blue-500" />
                    <span>New</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('Contacted')}>
                    <Send className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>Contacted</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('Won')}>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Won</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('Lost')}>
                    <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Lost</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
