import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva('flex items-center gap-3 rounded-lg border px-4 py-3 w-full', {
    variants: {
        variant: {
            default: 'border-border bg-[var(--alert-background)] text-foreground',
            destructive: 'border-border bg-[var(--alert-background)] text-destructive [&_svg]:text-destructive [&_p]:text-destructive',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(
    ({ className, variant, children, ...props }, ref) => (
        <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
            {children}
        </div>
    ),
);
Alert.displayName = 'Alert';

const AlertIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex shrink-0 items-start pt-0.5', className)} {...props} />
));
AlertIcon.displayName = 'AlertIcon';

const AlertContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-1 flex-col gap-1', className)} {...props} />
));
AlertContent.displayName = 'AlertContent';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('text-sm font-medium leading-normal', className)} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn(
                'text-sm leading-normal text-muted-foreground [&_p]:leading-normal [&_ul]:mt-2 [&_ul]:list-disc [&_li]:ml-5',
                'group-[[data-destructive]]:text-destructive',
                className,
            )}
            {...props}
        />
    ),
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription };
