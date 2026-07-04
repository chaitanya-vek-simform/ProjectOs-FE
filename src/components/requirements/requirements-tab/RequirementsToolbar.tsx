import { Search } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const L = LABELS.REQUIREMENTS.REQUIREMENTS;

const FILTER_ALL = "all";

interface RequirementsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

/** Search + type filter row for the Requirements tab. */
function RequirementsToolbar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: RequirementsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <Input
          placeholder={L.SEARCH_PLACEHOLDER}
          className="pl-9"
          aria-label={L.SEARCH_PLACEHOLDER}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="sm:w-48" aria-label={L.FILTER_LABEL}>
          <SelectValue placeholder={L.FILTER_ALL} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL}>{L.FILTER_ALL}</SelectItem>
          <SelectItem value="functional">{L.FILTER_FUNCTIONAL}</SelectItem>
          <SelectItem value="non_functional">
            {L.FILTER_NON_FUNCTIONAL}
          </SelectItem>
          <SelectItem value="risk">{L.FILTER_RISK}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export { RequirementsToolbar, FILTER_ALL };
