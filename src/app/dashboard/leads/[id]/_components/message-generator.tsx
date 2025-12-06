'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Lead } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { generateMessageAction } from '@/app/actions';
import { BotMessageSquare, Copy, Send, Loader2, Mail, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  tone: z.enum(['friendly', 'professional'], {
    required_error: 'You need to select a message tone.',
  }),
  channel: z.enum(['email', 'WhatsApp'], {
    required_error: 'You need to select a channel.',
  }),
});

export default function MessageGenerator({ lead }: { lead: Lead }) {
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tone: 'friendly',
      channel: 'email',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedMessage('');
    
    const input = {
        leadDetails: `Name: ${lead.name}, Company: ${lead.company}, Recent Activity: ${lead.recentActivity}`,
        productDetails: "Our product is a leading B2B SaaS platform that helps businesses with lead management and sales automation.",
        tone: values.tone,
        channel: values.channel,
    }

    const result = await generateMessageAction(input);

    if (result.success && result.message) {
        setGeneratedMessage(result.message);
    } else {
        toast({
            variant: 'destructive',
            title: 'Message Generation Failed',
            description: result.error,
        });
    }
    
    setIsGenerating(false);
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast({
        title: 'Copied to clipboard!',
    });
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
            <div className="space-y-2">
                <div className="animate-pulse bg-muted h-6 w-1/4 rounded-md"></div>
                <div className="animate-pulse bg-muted h-20 w-full rounded-md"></div>
            </div>
        )}

        {generatedMessage && (
          <div className="space-y-4">
            <h3 className="font-semibold">Generated Message</h3>
            <div className="relative">
                <Textarea value={generatedMessage} readOnly rows={8} className="bg-secondary pr-10" />
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
