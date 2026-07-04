import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * PageContainer — the outermost content wrapper for a routed page.
 * Standardises max-width, horizontal gutters and vertical rhythm so every
 * screen shares the same layout envelope. Spacing comes from the Tailwind
 * scale (backed by design-system tokens), never hardcoded values.
 */
const pageContainerVariants = cva('mx-auto w-full', {
    variants: {
        size: {
            sm: 'max-w-3xl',
            md: 'max-w-5xl',
            lg: 'max-w-7xl',
            full: 'max-w-none',
        },
        gutter: {
            none: '',
            default: 'px-4 py-6 md:px-6 md:py-8',
            compact: 'px-4 py-4',
        },
    },
    defaultVariants: {
        size: 'lg',
        gutter: 'default',
    },
});

type PageContainerProps = React.ComponentProps<'div'> & VariantProps<typeof pageContainerVariants>;

function PageContainer({ className, size, gutter, ...props }: PageContainerProps) {
    return <div data-slot="page-container" className={cn(pageContainerVariants({ size, gutter }), className)} {...props} />;
}

export { PageContainer };
