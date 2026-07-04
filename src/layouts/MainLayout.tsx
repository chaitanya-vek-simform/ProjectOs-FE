import * as React from 'react';

import { Typography } from '@/components/common/typography/typography';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
    children: React.ReactNode;
    /** Optional sidebar navigation node. */
    sidebar?: React.ReactNode;
}

/**
 * MainLayout — the application shell: a branded sidebar rail plus a scrollable
 * content region. The sidebar uses the design-system gradient tokens. This is a
 * structural wrapper only — routing and navigation content are wired in later.
 */
function MainLayout({ children, sidebar }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-background">
            <aside className={cn('bg-sidebar-gradient hidden w-64 shrink-0 flex-col gap-6 px-4 py-6 text-sidebar-foreground md:flex')}>
                <Typography variant="large" className="text-sidebar-foreground">
                    ProjectOS
                </Typography>
                <nav className="flex flex-col gap-1">{sidebar}</nav>
            </aside>
            <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
        </div>
    );
}

export { MainLayout };
