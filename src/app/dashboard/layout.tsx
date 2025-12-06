'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Users,
  Upload,
  Settings,
  Bell,
  Search,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard'}
                tooltip={{children: 'Dashboard'}}
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/dashboard/leads')}
                tooltip={{children: 'Leads'}}
              >
                <Link href="/dashboard/leads">
                  <Users />
                  <span>Leads</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard/upload'}
                tooltip={{children: 'Upload Leads'}}
              >
                <Link href="/dashboard/upload">
                  <Upload />
                  <span>Upload Leads</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard/settings'}
                tooltip={{children: 'Settings'}}
              >
                <Link href="/dashboard/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-3 px-2 py-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://picsum.photos/seed/user/40/40" data-ai-hint="person" />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate group-data-[state=collapsed]:hidden">
                  <span className="font-semibold text-sm text-sidebar-foreground truncate">Syntax Squad</span>
                  <span className="text-xs text-sidebar-foreground/70 truncate">admin@syntaxsquad.com</span>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
             {/* Can add breadcrumbs or page title here */}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative flex-1 md:grow-0">
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <Avatar className="h-9 w-9 hidden md:flex">
              <AvatarImage src="https://picsum.photos/seed/user-avatar/36/36" data-ai-hint="person" />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
