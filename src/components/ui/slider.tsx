import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
    React.ComponentRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, min, max, ...props }, ref) => {
    const isLocked = typeof min === 'number' && typeof max === 'number' && min === max;

    return (
        <SliderPrimitive.Root
            ref={ref}
            min={min}
            max={max}
            className={cn('relative flex w-full touch-none items-center select-none p-2', className)}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>

            {(props.value ?? props.defaultValue ?? []).map((_, i) => (
                <SliderPrimitive.Thumb
                    key={i}
                    style={isLocked ? { transform: 'translateX(50%)' } : undefined}
                    className="block size-4 cursor-pointer rounded-full border border-primary bg-background shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                />
            ))}
        </SliderPrimitive.Root>
    );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
