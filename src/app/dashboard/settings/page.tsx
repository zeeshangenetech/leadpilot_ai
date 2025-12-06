
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
import { useEffect, useState } from 'react';
import { Mail, Trash2, Loader2, DatabaseZap } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteAllLeads } from '@/lib/leads-service';
import { useRouter } from 'next/navigation';
import { resetStats } from '@/lib/stats-service';

const formSchema = z.object({
  host: z.string().min(1, 'Host is required.'),
  port: z.coerce.number().min(1, 'Port is required.'),
  user: z.string().min(1, 'Username is required.'),
  pass: z.string().min(1, 'Password is required.'),
  from: z.string().email('Invalid email address.'),
});

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function handleDeleteAllData() {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation
      deleteAllLeads();
      resetStats();
      toast({
        title: 'Data Deleted',
        description: 'All lead and statistical data has been successfully deleted.',
      });
      // Force a reload to ensure all state is cleared
      window.location.href = '/dashboard';
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete data.',
      });
    } finally {
      setIsDeleting(false);
    }
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

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DatabaseZap className="h-5 w-5 text-destructive" />
                    <span>Data Management</span>
                </CardTitle>
                <CardDescription>
                    Manage your application&apos;s data. This action cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete All Leads
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all of your lead data and reset message counts from your browser&apos;s local storage.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAllData}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Yes, delete all data
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    </div>
  );
}
