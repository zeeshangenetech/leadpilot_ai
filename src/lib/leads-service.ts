
'use client';
import { initialLeads } from './data';
import type { Lead } from './types';

const LEADS_STORAGE_KEY = 'leadpilot-leads';

function getStoredLeads(): Lead[] {
  if (typeof window === 'undefined') {
    return [...initialLeads];
  }
  try {
    const stored = window.localStorage.getItem(LEADS_STORAGE_KEY);
    if (stored) {
      // Dates are stored as strings in JSON, so we need to convert them back
      const parsedLeads: Omit<Lead, 'lastActivity'> & { lastActivity: string }[] = JSON.parse(stored);
      return parsedLeads.map(lead => ({
        ...lead,
        lastActivity: new Date(lead.lastActivity),
      }));
    }
  } catch (error) {
    console.error('Error reading leads from localStorage:', error);
  }
  // If nothing is stored, initialize with initial leads
  const leads = [...initialLeads];
  try {
    window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error('Error saving initial leads to localStorage:', error);
  }
  return leads;
}

function saveLeads(leads: Lead[]): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (error) {
        console.error('Error saving leads to localStorage:', error);
    }
}


export function getLeads(): Lead[] {
  return getStoredLeads();
}

export function getLeadById(id: string): Lead | undefined {
  const allLeads = getStoredLeads();
  return allLeads.find((lead) => lead.id === id);
}

export function addLeads(newLeads: Lead[]): void {
  const allLeads = getStoredLeads();
  const newLeadsWithUniqueIds = newLeads.filter(
    (newLead) => !allLeads.some((existingLead) => existingLead.id === newLead.id)
  );
  const updatedLeads = [...allLeads, ...newLeadsWithUniqueIds];
  saveLeads(updatedLeads);
}

export function deleteAllLeads(): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.removeItem(LEADS_STORAGE_KEY);
    } catch (error) {
        console.error('Error deleting leads from localStorage:', error);
    }
}
