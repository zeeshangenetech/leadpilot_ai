'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Lead } from '@/lib/types';
import { getUpsellSuggestionsByLeadId } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateMessageAction, sendEmailAction } from '@/app/actions';
import { BotMessageSquare, Copy, Send, Loader2, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getSettings } from '@/lib/settings-service';

const formSchema = z.object({
  cta: z.string().min(1, 'Call to action is required.'),
  signature: z.string().min(1, 'Email signature is required.'),
});

type GeneratedMessage = {
    subject: string;
    body: string;
}

export default function MessageGenerator({ lead }: { lead: Lead }) {
  const [generatedMessage, setGeneratedMessage] = useState<GeneratedMessage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cta: 'Would you be open to a brief chat next week?',
      signature: 'The Syntax Squad',
    },
  });
  
  const upsellSuggestions = getUpsellSuggestionsByLeadId(lead.id);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedMessage(null);
    
    const upsell = upsellSuggestions.length > 0 ? upsellSuggestions[0] : undefined;

    const input = {
      CustomerName: lead.name,
      CompanyName: lead.company || 'their company',
      LeadDescription: lead.recentActivity,
      Platform: lead.source,
      Product: 'LeadPilot AI', // This could be made dynamic
      Reason: 'It helps streamline lead management and outreach.', // This could be made dynamic
      Upsell: upsell ? `${upsell.productName} (reason: ${upsell.reason})` : 'N/A',
      CTA: values.cta,
      EmailSignature: values.signature,
    }

    const result = await generateMessageAction(input);

    if (result.success && result.data) {
        setGeneratedMessage(result.data);
    } else {
        toast({
            variant: 'destructive',
            title: 'Message Generation Failed',
            description: result.error,
        });
    }
    
    setIsGenerating(false);
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: 'Copied to clipboard!',
    });
  };

  const handleSendMessage = async () => {
    if (!generatedMessage) return;

    setIsSending(true);
    const settings = getSettings();
    if (!settings.smtp) {
      toast({
        variant: 'destructive',
        title: 'SMTP Settings Missing',
        description: 'Please configure your SMTP settings on the Settings page before sending emails.',
      });
      setIsSending(false);
      return;
    }

    const result = await sendEmailAction({
      smtpSettings: settings.smtp,
      to: lead.email,
      subject: generatedMessage.subject,
      body: generatedMessage.body,
    });

    if (result.success) {
      toast({
        title: 'Email Sent!',
        description: `Message sent to ${lead.name}.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Send Email',
        description: result.error,
      });
    }
    setIsSending(false);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BotMessageSquare className="h-5 w-5 text-primary" />
            <span>AI Email Generator</span>
        </CardTitle>
        <CardDescription>
          Generate a personalized outreach email for this lead.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="cta"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Call to Action</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Schedule a demo?" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="signature"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Signature</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <Button type="submit" disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Email
            </Button>
          </form>
        </Form>
        
        {(isGenerating || generatedMessage) && <Separator className="my-6" />}
        
        {isGenerating && (
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="animate-pulse bg-muted h-5 w-1/3 rounded-md"></div>
                    <div className="animate-pulse bg-muted h-4 w-1/4 rounded-md"></div>
                </div>
                 <div className="animate-pulse bg-muted h-24 w-full rounded-md"></div>
            </div>
        )}

        {generatedMessage && (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Generated Email</h3>
                </div>
                <div className="space-y-4 rounded-md border p-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Subject</p>
                        <p className="font-semibold">{generatedMessage.subject}</p>
                    </div>
                    <div className="relative">
                         <p className="text-sm font-medium text-muted-foreground">Body</p>
                        <Textarea value={generatedMessage.body} readOnly rows={12} className="bg-secondary pr-10 mt-1" />
                        <Button variant="ghost" size="icon" className="absolute top-6 right-2" onClick={() => copyToClipboard(generatedMessage.body)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                 <Button className="mt-4" onClick={handleSendMessage} disabled={isSending}>
                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Send Email
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
