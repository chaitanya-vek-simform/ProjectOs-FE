import * as React from 'react';
import { X } from 'lucide-react';

import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SelectWithClearProps {
    value?: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    id?: string;
    size?: 'sm' | 'default';
    className?: string;
    placeholder?: string;
    'aria-invalid'?: boolean;
    allowClear?: boolean;
    /** SelectItem nodes to render inside SelectContent */
    children: React.ReactNode;
}

/**
 * A Select wrapper that shows a clear (×) button visually inside the trigger when a value is selected.
 * The clear button is rendered outside the trigger (avoiding button nesting), but positioned absolutely
 * to appear inside the trigger area. Clicking × clears the value without opening the dropdown.
 */
export function SelectWithClear({
    value,
    onValueChange,
    disabled,
    id,
    size = 'default',
    className,
    placeholder,
    'aria-invalid': ariaInvalid,
    allowClear = true,
    children,
}: SelectWithClearProps) {
    return (
        <div className="relative">
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger id={id} size={size} className={cn(className)} aria-invalid={ariaInvalid}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>{children}</SelectContent>
            </Select>
            {value && !disabled && allowClear && (
                <button
                    type="button"
                    aria-label="Clear selection"
                    className="absolute right-8 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground focus:outline-none"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onValueChange('');
                    }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}
