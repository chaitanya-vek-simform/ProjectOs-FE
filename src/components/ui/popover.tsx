import * as React from 'react';
import { Popover } from 'radix-ui';

import { cn } from '@/lib/utils';

/** Provides a stable `close` callback from the nearest PopoverRoot down to PopoverContent. */
const PopoverCloseContext = React.createContext<() => void>(() => {});

/**
 * Wraps Popover.Root to manage open state and expose a close function via context.
 * This lets PopoverContent close the popover on page scroll without dispatching
 * synthetic keyboard events.
 */
const PopoverRoot = ({ open: openProp, onOpenChange, defaultOpen, ...props }: React.ComponentPropsWithoutRef<typeof Popover.Root>) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;

    const setOpen = React.useCallback(
        (next: boolean) => {
            if (!isControlled) setInternalOpen(next);
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
    );

    const close = React.useCallback(() => setOpen(false), [setOpen]);

    return (
        <PopoverCloseContext.Provider value={close}>
            <Popover.Root open={open} onOpenChange={setOpen} {...props} />
        </PopoverCloseContext.Provider>
    );
};

const PopoverTrigger = Popover.Trigger;

const PopoverAnchor = Popover.Anchor;

const PopoverContent = React.forwardRef<React.ComponentRef<typeof Popover.Content>, React.ComponentPropsWithoutRef<typeof Popover.Content>>(
    ({ className, align = 'center', sideOffset = 4, ...props }, ref) => {
        const close = React.useContext(PopoverCloseContext);
        const contentRef = React.useRef<HTMLDivElement>(null);

        React.useEffect(() => {
            const handleScroll = (e: Event) => {
                // Do not close when scrolling inside the popover content itself
                if (contentRef.current && e.target instanceof Node && contentRef.current.contains(e.target)) {
                    return;
                }
                close();
            };

            window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
            return () => window.removeEventListener('scroll', handleScroll, true);
        }, [close]);

        return (
            <Popover.Portal>
                <Popover.Content
                    ref={(node) => {
                        contentRef.current = node;
                        if (typeof ref === 'function') ref(node);
                        else if (ref) ref.current = node;
                    }}
                    align={align}
                    sideOffset={sideOffset}
                    className={cn(
                        'z-50 w-72 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none',
                        'data-[state=open]:animate-in data-[state=closed]:animate-out',
                        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
                        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                        className,
                    )}
                    {...props}
                />
            </Popover.Portal>
        );
    },
);

PopoverContent.displayName = Popover.Content.displayName;

export { PopoverRoot as Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
