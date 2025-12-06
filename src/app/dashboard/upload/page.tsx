
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
        transformHeader: header => header.trim().replace(/ /g, ''), // Remove spaces from headers
        complete: (results) => {
          const leadsData: Lead[] = results.data.map((row: any, index: number) => {
            const projectTypes = [
              row['demand_signal/project_type/0'],
              row['demand_signal/project_type/1'],
              row['demand_signal/project_type/2'],
              row['demand_signal/project_type/3'],
            ].filter(Boolean);

            const lead: Lead = {
              id: row.lead_id || `temp-id-${Date.now()}-${index}`,
              name: `${row['lead_profile/first_name']} ${row['lead_profile/last_name']}`,
              email: row['lead_profile/email'],
              company: row['company_profile/name'],
              avatar: `https://picsum.photos/seed/${row.lead_id || index}/100/100`,
              source: 'LinkedIn', // Defaulting as CSV doesn't specify this in a format we can easily use yet.
              score: Math.floor(Math.random() * 60) + 40, // Random score for now
              scoreCategory: ['Hot', 'Warm', 'Cold'][Math.floor(Math.random() * 3)] as 'Hot' | 'Warm' | 'Cold',
              scoreExplanation: 'Score based on imported data.',
              lastActivity: new Date(row['demand_signal/post_date']) || new Date(),
              tags: projectTypes,
              interactionCount: 1,
              purchaseHistory: [],
              linkedinProfile: `https://linkedin.com/in/${row['lead_profile/first_name']?.toLowerCase()}${row['lead_profile/last_name']?.toLowerCase()}`,
              website: `https://${row['company_profile/name']?.toLowerCase().replace(/ /g, '')}.com`,
              recentActivity: row['demand_signal/post_snippet'],
            };
            return lead;
          }).filter(lead => lead.id && lead.name && lead.email);

          addLeads(leadsData);
          setParsedLeads(leadsData);
          setIsParsing(false);
          toast({
            title: 'Upload Successful',
            description: `${leadsData.length} leads have been parsed and added.`,
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
