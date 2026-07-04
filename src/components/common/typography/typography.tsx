import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

/**
 * Typography — the single, token-driven text primitive for the design system.
 * Every size/weight/tone maps to a CSS variable defined in index.css; no page
 * should hardcode font sizes or colors. Use `asChild` to render onto another
 * element (e.g. a link) while keeping the type styles.
 */
const typographyVariants = cva('', {
    variants: {
        variant: {
            h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight md:text-5xl',
            h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
            h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
            h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
            lead: 'text-xl text-muted-foreground',
            large: 'text-lg font-semibold',
            body: 'text-base leading-6',
            small: 'text-sm font-medium leading-none',
            muted: 'text-sm text-muted-foreground',
            caption: 'text-xs text-muted-foreground',
        },
        tone: {
            default: '',
            primary: 'text-primary',
            secondary: 'text-secondary-foreground',
            muted: 'text-muted-foreground',
            destructive: 'text-destructive',
        },
    },
    defaultVariants: {
        variant: 'body',
        tone: 'default',
    },
});

const VARIANT_ELEMENT: Record<NonNullable<VariantProps<typeof typographyVariants>['variant']>, React.ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    lead: 'p',
    large: 'div',
    body: 'p',
    small: 'small',
    muted: 'p',
    caption: 'span',
};

type TypographyProps = React.HTMLAttributes<HTMLElement> &
    VariantProps<typeof typographyVariants> & {
        asChild?: boolean;
    };

function Typography({ className, variant = 'body', tone = 'default', asChild = false, ...props }: TypographyProps) {
    const Comp = asChild ? Slot.Root : VARIANT_ELEMENT[variant ?? 'body'];

    return <Comp data-slot="typography" className={cn(typographyVariants({ variant, tone }), className)} {...props} />;
}

export { Typography };
