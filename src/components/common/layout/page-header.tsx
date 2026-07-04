import * as React from 'react';

import { Typography } from '@/components/common/typography/typography';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.ComponentProps<'div'> {
    title: string;
    description?: string;
    /** Right-aligned actions (buttons, filters, etc.). */
    actions?: React.ReactNode;
}

/**
 * PageHeader — title/description on the left, actions on the right.
 * Used at the top of a PageContainer for a consistent page masthead.
 */
function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
    return (
        <div
            data-slot="page-header"
            className={cn('flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between', className)}
            {...props}
        >
            <div className="flex flex-col gap-1">
                <Typography variant="h3" asChild>
                    <h1>{title}</h1>
                </Typography>
                {description && <Typography variant="muted">{description}</Typography>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    );
}

export { PageHeader };
