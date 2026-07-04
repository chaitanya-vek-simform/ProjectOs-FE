import { useRef, useState } from "react";
import { Loader2, UploadCloud, File } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { useUploadDocument } from "@/hooks/requirements/mutations";
import { Button } from "@/components/ui/button";

const L = LABELS.REQUIREMENTS.UPLOAD;
const TOAST_L = LABELS.REQUIREMENTS.TOAST;
const ACCEPTED_FORMATS = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];

interface PendingUpload {
  id: string;
  file: File;
}

interface UploadDropzoneProps {
  projectId: string | undefined;
}

/** RFP / requirement document upload dropzone with file browser and drag-drop support. */
function UploadDropzone({ projectId }: UploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: uploadDocument } = useUploadDocument(projectId ?? "");

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        setError(TOAST_L.INVALID_FILE_TYPE);
        return false;
      }
    }
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || !projectId) return;

    setError(null);

    Array.from(files).forEach((file) => {
      if (!validateFile(file)) return;

      const id = `${file.name}-${file.size}-${file.lastModified}`;
      setPendingUploads((prev) => [...prev, { id, file }]);
      uploadDocument(file, {
        onSettled: () => {
          setPendingUploads((prev) => prev.filter((item) => item.id !== id));
        },
      });
    });
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
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          disabled={!projectId}
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
          aria-label={LABELS.REQUIREMENTS.UPLOAD_INPUT_ARIA}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {pendingUploads.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            {LABELS.REQUIREMENTS.DYNAMIC.UPLOADED_COUNT(pendingUploads.length)}
          </p>
          <div className="space-y-2">
            {pendingUploads.map((item) => (
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
                  </div>
                </div>
                <Loader2
                  className="size-4 animate-spin text-slate-400"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { UploadDropzone };
