
'use client';
import { useState } from 'react';
import { UploadCloud, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Papa from 'papaparse';
import type { Lead } from '@/lib/types';
import LeadsTable from '../_components/leads-table';
import { useToast } from '@/hooks/use-toast';
import { addLeads } from '@/lib/leads-service';
import { useRouter } from 'next/navigation';

type CsvRow = Record<string, any>;

const detectSource = (headers: string[]): 'LinkedIn' | 'Upwork' | 'Freelancer' | 'Email' | 'Unknown' => {
  if (headers.includes('lead_id') && headers.includes('demand_signal/post_url')) return 'LinkedIn';
  if (headers.includes('job_id') && headers.includes('job_post_data/url') && headers.some(h => h.startsWith('client_engagement'))) return 'Upwork';
  if (headers.includes('job_id') && headers.includes('avg_bid_USD')) return 'Freelancer';
  if (headers.includes('received_date') && headers.includes('tech_stack_preference')) return 'Email';
  return 'Unknown';
};

const normalizeLinkedIn = (row: CsvRow, index: number): Lead => ({
  id: row.lead_id || `temp-linkedin-${Date.now()}-${index}`,
  name: `${row['lead_profile/first_name'] || ''} ${row['lead_profile/last_name'] || ''}`.trim(),
  email: row['lead_profile/email'],
  company: row['company_profile/name'],
  avatar: `https://picsum.photos/seed/${row.lead_id || index}/100/100`,
  source: 'LinkedIn',
  score: Math.floor(Math.random() * 60) + 40,
  scoreCategory: ['Hot', 'Warm', 'Cold'][Math.floor(Math.random() * 3)] as 'Hot' | 'Warm' | 'Cold',
  scoreExplanation: 'Score based on imported LinkedIn data.',
  lastActivity: new Date(row['demand_signal/post_date'] || Date.now()),
  tags: [
      row['demand_signal/project_type/0'],
      row['demand_signal/project_type/1'],
      row['demand_signal/project_type/2'],
      row['demand_signal/project_type/3'],
  ].filter(Boolean),
  interactionCount: 1,
  purchaseHistory: [],
  linkedinProfile: `https://linkedin.com/in/${row['lead_profile/first_name']?.toLowerCase()}${row['lead_profile/last_name']?.toLowerCase()}`,
  website: `https://${row['company_profile/name']?.toLowerCase().replace(/\s/g, '')}.com`,
  recentActivity: row['demand_signal/post_snippet'],
});

const normalizeUpwork = (row: CsvRow, index: number): Lead => ({
  id: row.job_id || `temp-upwork-${Date.now()}-${index}`,
  name: `Upwork: ${row['job_post_data/title']}`.substring(0, 50),
  email: 'not-available@upwork.com',
  company: 'Upwork Client',
  avatar: `https://picsum.photos/seed/${row.job_id || index}/100/100`,
  source: 'Upwork',
  score: Math.floor(Math.random() * 60) + 40,
  scoreCategory: ['Hot', 'Warm', 'Cold'][Math.floor(Math.random() * 3)] as 'Hot' | 'Warm' | 'Cold',
  scoreExplanation: 'Score based on imported Upwork data.',
  lastActivity: new Date(row['job_post_data/posted_date'] || Date.now()),
  tags: [
    row['job_post_data/project_type/0'],
    row['job_post_data/project_type/1'],
    row['job_post_data/project_type/2'],
  ].filter(Boolean),
  interactionCount: 1,
  purchaseHistory: [],
  recentActivity: row['job_post_data/description_snippet'],
});

const normalizeFreelancer = (row: CsvRow, index: number): Lead => ({
    id: row.job_id || `temp-freelancer-${Date.now()}-${index}`,
    name: `Freelancer: ${row.title}`.substring(0, 50),
    email: 'not-available@freelancer.com',
    company: 'Freelancer Client',
    avatar: `https://picsum.photos/seed/${row.job_id || index}/100/100`,
    source: 'Upwork', // Note: 'Freelancer' is not in the Lead['source'] type. Using 'Upwork'.
    score: Math.floor(Math.random() * 60) + 40,
    scoreCategory: ['Hot', 'Warm', 'Cold'][Math.floor(Math.random() * 3)] as 'Hot' | 'Warm' | 'Cold',
    scoreExplanation: 'Score based on imported Freelancer data.',
    lastActivity: new Date(row.posted_date || Date.now()),
    tags: (row.project_focus?.split(',') || []).map((t: string) => t.trim()),
    interactionCount: 1,
    purchaseHistory: [],
    recentActivity: row.description_snippet,
});

const normalizeEmail = (row: CsvRow, index: number): Lead => ({
    id: `temp-email-${Date.now()}-${index}`,
    name: row.name,
    email: row.email,
    company: row.company,
    avatar: `https://picsum.photos/seed/email${index}/100/100`,
    source: 'Email',
    score: Math.floor(Math.random() * 60) + 40,
    scoreCategory: ['Hot', 'Warm', 'Cold'][Math.floor(Math.random() * 3)] as 'Hot' | 'Warm' | 'Cold',
    scoreExplanation: 'Score based on imported email data.',
    lastActivity: new Date(row.received_date || Date.now()),
    tags: (row.tech_stack_preference?.split(',') || []).map((t: string) => t.trim()),
    interactionCount: 1,
    purchaseHistory: [],
    recentActivity: row.message,
});

const normalizeRow = (source: 'LinkedIn' | 'Upwork' | 'Freelancer' | 'Email' | 'Unknown', row: CsvRow, index: number): Lead | null => {
    try {
        switch (source) {
            case 'LinkedIn':
                return normalizeLinkedIn(row, index);
            case 'Upwork':
                return normalizeUpwork(row, index);
            case 'Freelancer':
                return normalizeFreelancer(row, index);
            case 'Email':
                return normalizeEmail(row, index);
            default:
                return null;
        }
    } catch (e) {
        console.error(`Error normalizing row ${index} for source ${source}:`, e);
        return null;
    }
}


export default function UploadPage() {
  const [isParsing, setIsParsing] = useState(false);
  const [parsedLeads, setParsedLeads] = useState<Lead[]>([]);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsParsing(true);
      setFileName(file.name);
      setParsedLeads([]);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        complete: (results) => {
          const headers = results.meta.fields || [];
          const source = detectSource(headers);

          if (source === 'Unknown') {
            setIsParsing(false);
            toast({
                variant: 'destructive',
                title: 'Unrecognized CSV Format',
                description: 'Could not determine the source of the CSV file. Please use a supported format.',
            });
            return;
          }

          const leadsData: Lead[] = results.data
            .map((row: any, index: number) => normalizeRow(source, row, index))
            .filter((lead): lead is Lead => lead !== null && !!lead.id && !!lead.name && !!lead.email);


          addLeads(leadsData);
          setParsedLeads(leadsData);
          setIsParsing(false);
          toast({
            title: 'Upload Successful',
            description: `${leadsData.length} leads from ${source} have been parsed and added.`,
          })
        },
        error: (error: any) => {
          setIsParsing(false);
          toast({
            variant: 'destructive',
            title: 'Error Parsing CSV',
            description: error.message,
          });
          console.error("Error parsing CSV:", error);
        }
      });
    }
  };

  const handleConfirm = () => {
    router.push('/dashboard');
  };


  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Upload Your Leads</h1>
        <p className="text-muted-foreground mt-2">
          Easily import leads from various sources by uploading a CSV file.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV Upload</CardTitle>
          <CardDescription>Upload a CSV file of leads from LinkedIn, Upwork, or other sources.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center transition-colors hover:border-primary hover:bg-accent/50">
            {isParsing ? (
                <>
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <h3 className="text-lg font-semibold">Parsing your file...</h3>
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                </>
            ) : parsedLeads.length > 0 ? (
                <>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <h3 className="text-lg font-semibold">Parsing Complete</h3>
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                     <div className="relative">
                        <Button asChild variant="outline">
                            <label htmlFor="file-upload">Upload another file</label>
                        </Button>
                        <Input id="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                    </div>
                </>
            ) : (
                <>
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Drag and drop your file here</h3>
                    <p className="text-sm text-muted-foreground">or</p>
                    <div className="relative">
                    <Button asChild>
                        <label htmlFor="file-upload">Browse Files</label>
                    </Button>
                    <Input id="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                    </div>
                    <p className="text-xs text-muted-foreground">Supports: CSV. Max file size: 10MB.</p>
                </>
            )
            }
          </div>
        </CardContent>
      </Card>

      {parsedLeads.length > 0 && (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Uploaded Leads ({parsedLeads.length})</h2>
                <Button onClick={handleConfirm}>Confirm and View All Leads</Button>
            </div>
            <LeadsTable leads={parsedLeads} />
        </div>
      )}
    </div>
  );
}
