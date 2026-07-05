import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  readonly content: string;
  readonly className?: string;
}

/**
 * Shared Markdown renderer (headings, lists, tables, inline code, links).
 * Styling is scoped locally via arbitrary selectors rather than a typography
 * plugin so it stays self-contained. Reused by the assistant chat and meeting
 * minutes (MOM); pass `className` to tune spacing per surface.
 */
function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "min-w-0 w-full space-y-2 text-sm leading-relaxed overflow-hidden [&_a]:break-all [&_a]:text-indigo-600 [&_a]:underline [&_code]:break-all [&_code]:rounded [&_code]:bg-slate-200/70 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:font-semibold [&_li]:my-0.5 [&_li]:break-words [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:break-words [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:text-xs [&_pre]:text-slate-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_td]:border [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-slate-200 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

export { MarkdownContent };
