import { useRef, useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LABELS } from '@/constants/labels';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onChange: (value: string) => void;
    /** Called whenever the search input changes — use for server-side filtering */
    onSearchChange?: (query: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    id?: string;
    invalid?: boolean;
}

export function Combobox({
    options,
    value,
    onChange,
    onSearchChange,
    placeholder = LABELS.COMMON.COMBOBOX.SELECT_PLACEHOLDER,
    searchPlaceholder = LABELS.COMMON.COMBOBOX.SEARCH_PLACEHOLDER,
    emptyText = LABELS.COMMON.COMBOBOX.NO_RESULTS,
    isLoading = false,
    disabled,
    className,
    id,
    invalid,
}: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const commandListRef = useRef<HTMLDivElement>(null);
    const selected = options.find((o) => o.value === value);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (commandListRef.current) {
            commandListRef.current.scrollTop += e.deltaY;
        }
    };

    return (
        <Popover
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                if (!o) onSearchChange?.('');
            }}
        >
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={invalid}
                    disabled={disabled}
                    className={cn(
                        'h-8 w-full justify-between px-3 py-1 text-sm font-normal',
                        !selected && 'text-muted-foreground',
                        className,
                    )}
                >
                    <span className="truncate">{selected ? selected.label : placeholder}</span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-(--radix-popover-trigger-width) p-0" align="start">
                {/* shouldFilter=false disables Command's built-in client filter — results come from server */}
                <Command shouldFilter={!onSearchChange}>
                    <CommandInput placeholder={searchPlaceholder} className="h-8 text-sm" onValueChange={onSearchChange} />
                    <CommandList ref={commandListRef} onWheel={handleWheel} className="max-h-48 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">{emptyText}</CommandEmpty>
                                <CommandGroup>
                                    {options.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.label}
                                            onSelect={() => {
                                                onChange(option.value === value ? '' : option.value);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check className={cn('mr-2 size-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
