import { useRef, useState } from "react";
import { UploadCloud, X, File } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { Button } from "@/components/ui/button";

const L = LABELS.REQUIREMENTS.UPLOAD;
const ACCEPTED_FORMATS = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];

interface UploadedFile {
  file: File;
  id: string;
}

/** RFP / requirement document upload dropzone with file browser and drag-drop support. */
function UploadDropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        setError(
          `Invalid file type: ${file.name}. Only PDF, DOCX, and TXT files are allowed.`,
        );
        return false;
      }
    }
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setError(null);
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        newFiles.push({
          file,
          id: `${file.name}-${Date.now()}`,
        });
      }
    });

    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-indigo-600 bg-indigo-100"
            : "border-indigo-300 bg-indigo-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <UploadCloud className="size-7" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-slate-800">{L.HEADLINE}</p>
        <p className="mt-1 text-xs text-slate-500">{L.HINT}</p>
        <Button
          type="button"
          className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={handleBrowseClick}
        >
          {L.BROWSE}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload document files"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Uploaded Files ({uploadedFiles.length})
          </p>
          <div className="space-y-2">
            {uploadedFiles.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <File className="size-5 text-indigo-600" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(item.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className="rounded-md p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                  aria-label={`Remove ${item.file.name}`}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { UploadDropzone };
