import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LABELS } from "@/constants/labels";

const auth = LABELS.AUTH;

function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative flex">
      <Input
        type={isVisible ? "text" : "password"}
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        aria-label={isVisible ? auth.HIDE_PASSWORD : auth.SHOW_PASSWORD}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200"
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
