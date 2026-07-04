import { useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LABELS } from '@/constants/labels';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
    value: string;
    label: string;
    color?: string;
    disabled?: boolean;
    iconUrl?: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    value: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    showSearch?: boolean;
    disabled?: boolean;
    className?: string;
    id?: string;
    'aria-invalid'?: boolean;
    'aria-label'?: string;
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = LABELS.COMMON.COMBOBOX.SELECT_PLACEHOLDER,
    searchPlaceholder = LABELS.COMMON.COMBOBOX.SEARCH_PLACEHOLDER,
    showSearch = true,
    disabled,
    className,
    id,
    'aria-invalid': ariaInvalid,
    'aria-label': ariaLabel,
}: Readonly<MultiSelectProps>) {
    const [open, setOpen] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (listRef.current) {
            listRef.current.scrollTop += e.deltaY;
        }
    };

    const toggle = (val: string) => {
        if (disabled) return;
        onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val]);
    };

    const remove = (val: string) => {
        if (disabled) return;
        onChange(value.filter((v) => v !== val));
    };

    const selectedOptions = options.filter((o) => value.includes(o.value));

    let triggerLabel = placeholder;
    if (value.length === 1) {
        triggerLabel = selectedOptions[0]?.label ?? placeholder;
    }
    if (value.length > 1) {
        triggerLabel = `${value.length} ${LABELS.COMMON.MULTI_SELECT.SELECTED_SUFFIX}`;
    }

    const singleSelected = value.length === 1 ? selectedOptions[0] : undefined;

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'h-9 w-full justify-between gap-2 px-3 font-normal shadow-xs',
                            !value.length && 'text-muted-foreground',
                        )}
                        aria-invalid={ariaInvalid}
                        aria-label={ariaLabel}
                    >
                        <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-sm">
                            {singleSelected?.iconUrl ? (
                                <img
                                    src={singleSelected.iconUrl}
                                    loading="lazy"
                                    className="size-4 shrink-0 object-contain"
                                    alt=""
                                    aria-hidden="true"
                                />
                            ) : null}
                            <span className="truncate">{triggerLabel}</span>
                        </span>
                        <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" aria-hidden="true" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                    <Command>
                        {showSearch ? <CommandInput placeholder={searchPlaceholder} className="h-8 text-sm" /> : null}
                        <CommandList ref={listRef} onWheel={handleWheel} className="max-h-48 overflow-y-scroll pr-1">
                            <CommandEmpty className="py-3 text-center text-sm text-muted-foreground">
                                {LABELS.COMMON.COMBOBOX.NO_RESULTS}
                            </CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = value.includes(option.value);
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.label}
                                            onSelect={() => !option.disabled && toggle(option.value)}
                                            className={cn('cursor-pointer', option.disabled && 'pointer-events-none opacity-50')}
                                            aria-disabled={option.disabled}
                                        >
                                            <div
                                                className={cn(
                                                    'mr-2 flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary',
                                                    isSelected ? 'bg-primary' : 'opacity-50',
                                                )}
                                            >
                                                {isSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                                            </div>
                                            {option.iconUrl ? (
                                                <img
                                                    src={option.iconUrl}
                                                    loading="lazy"
                                                    className="mr-1.5 size-[18px] shrink-0 object-contain"
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            ) : null}
                                            <span>{option.label}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selectedOptions.map((option) => (
                        <Badge key={option.value} variant="secondary" className={cn('gap-1', option.color ?? '')}>
                            {option.iconUrl ? (
                                <img
                                    src={option.iconUrl}
                                    loading="lazy"
                                    className="size-3.5 shrink-0 object-contain"
                                    alt=""
                                    aria-hidden="true"
                                />
                            ) : null}
                            <span>{option.label}</span>
                            {!disabled && (
                                <button
                                    type="button"
                                    className="ml-0.5 rounded hover:bg-foreground/10"
                                    onClick={() => remove(option.value)}
                                    aria-label={`${LABELS.COMMON.MULTI_SELECT.REMOVE_ARIA_PREFIX}${option.label}`}
                                >
                                    <X className="size-3" aria-hidden="true" />
                                </button>
                            )}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
