/**
 * Centralised UI copy. Design-system primitives read their default strings from
 * here so wording stays consistent and translatable. Feature modules extend this
 * object with their own namespaces.
 */
export const LABELS = {
    COMMON: {
        COMBOBOX: {
            SELECT_PLACEHOLDER: 'Select...',
            SEARCH_PLACEHOLDER: 'Search...',
            NO_RESULTS: 'No results found.',
        },
        MULTI_SELECT: {
            SELECTED_SUFFIX: 'selected',
            REMOVE_ARIA_PREFIX: 'Remove ',
        },
        COMMAND: {
            PALETTE_TITLE: 'Command Palette',
            SEARCH_PLACEHOLDER: 'Search for a command to run...',
        },
    },
} as const;
