
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getSettings, saveSettings, type SmtpSettings } from '@/lib/settings-service';
import { useEffect } from 'react';
import { Mail } from 'lucide-react';

const formSchema = z.object({
  host: z.string().min(1, 'Host is required.'),
  port: z.coerce.number().min(1, 'Port is required.'),
  user: z.string().min(1, 'Username is required.'),
  pass: z.string().min(1, 'Password is required.'),
  from: z.string().email('Invalid email address.'),
});

export default function SettingsPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      host: '',
      port: 587,
      user: '',
      pass: '',
      from: '',
    },
  });

  useEffect(() => {
    const currentSettings = getSettings();
    if (currentSettings.smtp) {
      form.reset(currentSettings.smtp);
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    saveSettings({ smtp: values });
    toast({
      title: 'Settings Saved',
      description: 'Your SMTP settings have been updated successfully.',
    });
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>SMTP Configuration</span>
                </CardTitle>
                <CardDescription>
                    Configure your SMTP server to send emails directly from the application.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="host"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>SMTP Host</FormLabel>
                                    <FormControl>
                                        <Input placeholder="smtp.example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="port"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>SMTP Port</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="587" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="from"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>From Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="your-email@example.com" {...field} />
                                </FormControl>
                                <FormDescription>The email address that messages will be sent from.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="user"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>SMTP Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your-username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="pass"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>SMTP Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit">Save Settings</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
