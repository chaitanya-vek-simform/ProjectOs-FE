import type { ReactNode } from "react";
import { Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LABELS } from "@/constants/labels";

const auth = LABELS.AUTH;

interface AuthLayoutProps {
  title: string;
  tagline: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
}

function AuthLayout({
  title,
  tagline,
  children,
  footer,
  maxWidthClassName = "max-w-md",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className={cn("w-full px-8", maxWidthClassName)}>
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white">
            <Zap className="h-5 w-5" />
            <span className="text-lg font-bold tracking-tight">
              {auth.BRAND}
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">{title}</h1>
          {tagline && <p className="text-slate-400">{tagline}</p>}
        </div>

        <Card className="rounded-2xl border border-white/10 bg-white/5 py-0 backdrop-blur">
          <CardContent className="p-8">{children}</CardContent>
        </Card>

        {footer && (
          <div className="mt-5 text-center text-sm text-slate-400">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export { AuthLayout };
export type { AuthLayoutProps };
