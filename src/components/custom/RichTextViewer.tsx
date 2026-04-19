import { cn } from "@/lib/utils";

export interface RichTextViewerProps {
  htmlContent: string;
  className?: string;
}

export function RichTextViewer({ htmlContent, className }: RichTextViewerProps) {
  if (!htmlContent) return null;

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none text-slate-800",
        // Additional custom styling for elements that ReactQuill might render
        "prose-p:my-1 prose-a:text-[#2563EB] prose-a:underline hover:prose-a:text-[#1d4ed8]",
        "prose-ul:list-disc prose-ol:list-decimal prose-li:my-0.5",
        "prose-strong:font-semibold prose-em:italic",
        className
      )}
      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
