import * as React from 'react';

import { Typography } from '@/components/common/typography/typography';
import { cn } from '@/lib/utils';

interface SectionProps extends React.ComponentProps<'section'> {
    title?: string;
    description?: string;
    actions?: React.ReactNode;
}

/**
 * Section — a titled content block within a page. Groups related content with a
 * consistent header treatment and vertical spacing.
 */
function Section({ title, description, actions, className, children, ...props }: SectionProps) {
    return (
        <section data-slot="section" className={cn('flex flex-col gap-4', className)} {...props}>
            {(title || actions) && (
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        {title && <Typography variant="large">{title}</Typography>}
                        {description && <Typography variant="muted">{description}</Typography>}
                    </div>
                    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </section>
    );
}

export { Section };
