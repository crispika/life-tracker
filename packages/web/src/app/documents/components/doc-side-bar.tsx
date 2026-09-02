'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      items: []
    },
    {
      title: 'Goals',
      url: '/goals',
      items: []
    },
    {
      title: 'Tasks',
      url: '/tasks',
      items: []
    },
    {
      title: 'Documentation',
      url: '#',
      items: [
        {
          title: 'Debug',
          url: '#'
        },
        {
          title: 'Deploy',
          url: '#'
        },
        {
          title: 'Tech Notes',
          url: '#'
        }
      ]
    }
  ]
};

export function DocSidebar() {
  return (
    <aside
      className={
        'border-grid fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block'
      }
    >
      <div
        className="h-full overflow-auto py-6 pr-4 lg:py-8"
        style={{ scrollbarWidth: 'none' }}
      >
        <SidebarProvider>
          <SidebarContent className="gap-0">
            {/* We create a collapsible SidebarGroup for each parent. */}
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                title={item.title}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarGroup>
                  <SidebarGroupLabel
                    asChild
                    className="group/label text-base mb-1 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <CollapsibleTrigger>
                      {item.title}{' '}
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {item.items.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ))}
          </SidebarContent>
        </SidebarProvider>
      </div>
    </aside>
  );
}
