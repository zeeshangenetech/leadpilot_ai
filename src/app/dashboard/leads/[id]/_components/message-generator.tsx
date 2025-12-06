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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { generateMessageAction, sendEmailAction } from '@/app/actions';
import { BotMessageSquare, Copy, Send, Loader2, Mail, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSettings } from '@/lib/settings-service';

const formSchema = z.object({
  tone: z.enum(['friendly', 'professional'], {
    required_error: 'You need to select a message tone.',
  }),
  channel: z.enum(['email', 'WhatsApp'], {
    required_error: 'You need to select a channel.',
  }),
});

type GeneratedMessage = {
    subject: string;
    body: string;
    variant_2: string;
}

export default function MessageGenerator({ lead }: { lead: Lead }) {
  const [generatedMessage, setGeneratedMessage] = useState<GeneratedMessage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('variant1');

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tone: 'friendly',
      channel: 'email',
    },
  });
  
  const upsellSuggestions = getUpsellSuggestionsByLeadId(lead.id);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedMessage(null);
    
    const upsell = upsellSuggestions.length > 0 ? upsellSuggestions[0] : undefined;

    const input = {
      name: lead.name,
      company: lead.company || 'their company',
      activity: lead.recentActivity,
      score: lead.score,
      category: lead.scoreCategory,
      product: 'LeadPilot AI',
      reason: 'It helps streamline lead management.',
      upsell: upsell ? `${upsell.productName} (reason: ${upsell.reason})` : undefined,
      tone: values.tone,
      channel: values.channel,
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

    const channel = form.getValues('channel');
    if (channel === 'WhatsApp') {
        const messageBody = activeTab === 'variant1' ? generatedMessage.body : generatedMessage.variant_2;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(messageBody)}`;
        window.open(whatsappUrl, '_blank');
        return;
    }

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
      body: activeTab === 'variant1' ? generatedMessage.body : generatedMessage.variant_2,
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
            <span>AI Message Generator</span>
        </CardTitle>
        <CardDescription>
          Generate personalized outreach messages for this lead.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Tone</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="friendly" />
                            </FormControl>
                            <FormLabel className="font-normal">Friendly</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="professional" />
                            </FormControl>
                            <FormLabel className="font-normal">Professional</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Channel</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="email" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground"/> Email</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="WhatsApp" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2"><MessageSquare className="w-4 h-4 text-muted-foreground"/> WhatsApp</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <Button type="submit" disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Message
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Generated Message</h3>
                <TabsList>
                    <TabsTrigger value="variant1">Variant 1</TabsTrigger>
                    <TabsTrigger value="variant2">Variant 2</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="variant1">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Subject</p>
                        <p className="font-semibold">{generatedMessage.subject}</p>
                    </div>
                    <div className="relative">
                        <Textarea value={generatedMessage.body} readOnly rows={8} className="bg-secondary pr-10" />
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(generatedMessage.body)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="variant2">
                <div className="space-y-4">
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Subject</p>
                        <p className="font-semibold">{generatedMessage.subject}</p>
                    </div>
                    <div className="relative">
                        <Textarea value={generatedMessage.variant_2} readOnly rows={8} className="bg-secondary pr-10" />
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(generatedMessage.variant_2)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </TabsContent>
             <Button className="mt-4" onClick={handleSendMessage} disabled={isSending}>
              {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Send Message
            </Button>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
