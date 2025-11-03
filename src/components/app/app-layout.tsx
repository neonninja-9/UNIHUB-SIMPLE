"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/app/user-nav";
import { Button } from "../ui/button";
import {
  LogOut,
  BarChart,
  BarChart3,
  Lightbulb,
  Calendar,
  BookOpen,
  Clock,
  Users,
  FileText,
  DollarSign,
  Award,
  Home,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  BarChart,
  BarChart3,
  Lightbulb,
  LogOut,
  Calendar,
  BookOpen,
  Clock,
  Users,
  FileText,
  DollarSign,
  Award,
  Home,
};

interface AppLayoutProps {
  children: ReactNode;
  user: { name: string; role: "Student" | "Teacher" };
  navLinks: { href: string; label: string; icon: string }[];
}

export function AppLayout({ children, user, navLinks }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 p-2">
            <Logo className="h-8 w-8" />
            <span className="font-headline text-lg font-semibold">UNIHUB</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map((link) => {
              const Icon = iconMap[link.icon];
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href}
                    tooltip={link.label}
                  >
                    <Link href={link.href}>
                      {Icon && <Icon />}
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-2">
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/">
              <LogOut />
              <span>Logout</span>
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4 md:p-6">
        <header className="mb-6 flex items-center justify-between">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <UserNav name={user.name} role={user.role} />
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
