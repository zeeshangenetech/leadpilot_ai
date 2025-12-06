import { Rocket } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
      <Rocket className="h-6 w-6" />
      <span className="hidden group-data-[state=collapsed]:hidden">
        LeadPilot AI
      </span>
    </div>
  );
}
