import { memo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/lib/utils";

// Cấu hình không upload ảnh/chặn media nhưng cho phép chọn màu
const quillModules = {
  toolbar: [
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = memo(function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-md border border-slate-300 overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50/50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[100px] [&_.ql-editor]:text-[14px] [&_.ql-editor.ql-blank::before]:text-slate-400 [&_.ql-editor.ql-blank::before]:font-normal",
        className
      )}
    >
      {/* @ts-expect-error ReactQuill lacks React 19 JSX types */}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={quillModules}
        placeholder={placeholder || "Nhập nội dung..."}
      />
    </div>
  );
});
