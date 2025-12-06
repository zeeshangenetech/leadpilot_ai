import { initialLeads } from './data';
import type { Lead } from './types';

let allLeads: Lead[] = [...initialLeads];

export function getLeads(): Lead[] {
  return allLeads;
}

export function getLeadById(id: string): Lead | undefined {
  return allLeads.find((lead) => lead.id === id);
}

export function addLeads(newLeads: Lead[]): void {
  const newLeadsWithUniqueIds = newLeads.filter(
    (newLead) => !allLeads.some((existingLead) => existingLead.id === newLead.id)
  );
  allLeads = [...allLeads, ...newLeadsWithUniqueIds];
}
