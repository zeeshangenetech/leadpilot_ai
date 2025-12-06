import { UploadCloud } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">
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
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Drag and drop your file here</h3>
            <p className="text-sm text-muted-foreground">or</p>
            <div className="relative">
              <Button asChild>
                <label htmlFor="file-upload">Browse Files</label>
              </Button>
              <Input id="file-upload" type="file" className="sr-only" />
            </div>
            <p className="text-xs text-muted-foreground">Supports: CSV. Max file size: 10MB.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
