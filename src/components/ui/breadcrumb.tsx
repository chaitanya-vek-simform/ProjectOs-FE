import React from 'react';
import { ChevronDown, ChevronRight, MoreHorizontal, Slash } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

/* ============================================================================
   Breadcrumb Container
   ============================================================================ */

interface BreadcrumbProps extends React.HTMLAttributes<HTMLOListElement> {
    separator?: 'chevron' | 'slash';
}

const Breadcrumb = React.forwardRef<HTMLOListElement, BreadcrumbProps>(({ className, separator = 'chevron', ...props }, ref) => (
    <ol ref={ref} className={cn('flex flex-wrap items-center gap-2.5', className)} {...props} />
));
Breadcrumb.displayName = 'Breadcrumb';

/* ============================================================================
   Breadcrumb Item
   ============================================================================ */

interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
    children: React.ReactNode;
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center', className)} {...props} />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

/* ============================================================================
   Breadcrumb Link - for navigable items
   ============================================================================ */

interface BreadcrumbLinkProps {
    to: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    className?: string;
    children?: React.ReactNode;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(({ className, to, ...props }, ref) => (
    <Link
        ref={ref}
        to={to}
        className={cn('px-1 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground', className)}
        {...props}
    />
));
BreadcrumbLink.displayName = 'BreadcrumbLink';

/* ============================================================================
   Breadcrumb Page - for current/active page
   ============================================================================ */

interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
}

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(({ className, ...props }, ref) => (
    <span ref={ref} className={cn('px-1 text-sm font-normal text-secondary-foreground', className)} {...props} />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

/* ============================================================================
   Breadcrumb Separator
   ============================================================================ */

interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
    type?: 'chevron' | 'slash';
}

const BreadcrumbSeparator = React.forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
    ({ className, type = 'chevron', ...props }, ref) => (
        <span ref={ref} className={cn('flex shrink-0 items-center text-muted-foreground', className)} {...props}>
            {type === 'chevron' && <ChevronRight className="size-3.75" />}
            {type === 'slash' && <Slash className="size-3.75" />}
        </span>
    ),
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

/* ============================================================================
   Breadcrumb Ellipsis - for collapsed items
   ============================================================================ */

interface BreadcrumbEllipsisProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const BreadcrumbEllipsis = React.forwardRef<HTMLButtonElement, BreadcrumbEllipsisProps>(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            'flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
            className,
        )}
        {...props}
    >
        <MoreHorizontal className="size-4" />
    </button>
));
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

/* ============================================================================
   Breadcrumb Dropdown - for dropdown menu items
   ============================================================================ */

interface BreadcrumbDropdownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const BreadcrumbDropdown = React.forwardRef<HTMLButtonElement, BreadcrumbDropdownProps>(({ className, children, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            'inline-flex items-center gap-1 rounded-2xs px-1 py-0.5 text-sm font-normal text-muted-foreground transition-colors hover:bg-accent hover:text-secondary-foreground',
            className,
        )}
        {...props}
    >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">{children}</span>
        <ChevronDown className="size-3.75 shrink-0" />
    </button>
));
BreadcrumbDropdown.displayName = 'BreadcrumbDropdown';

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, BreadcrumbDropdown };
