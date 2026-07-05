import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { useUploadDocument } from "@/hooks/requirements/mutations";
import { Button } from "@/components/ui/button";

import { DocumentUploadFlowDialog } from "./document-upload-flow/DocumentUploadFlowDialog";

import type { DocumentTaskResponse } from "@/types/requirements";

const L = LABELS.REQUIREMENTS.UPLOAD;
const TOAST_L = LABELS.REQUIREMENTS.TOAST;
const ACCEPTED_FORMATS = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];

interface UploadDropzoneProps {
  projectId: string | undefined;
}

/** RFP / requirement document upload dropzone that launches the analysis flow. */
function UploadDropzone({ projectId }: UploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<DocumentTaskResponse | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument(
    projectId ?? "",
  );

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
    if (!files?.length || !projectId || isUploading) return;

    setError(null);
    const file = files[0];
    if (!validateFile(file)) return;

    uploadDocument(file, {
      onSuccess: (task) => {
        setActiveTask(task);
        setDialogOpen(true);
      },
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
          disabled={!projectId || isUploading}
        >
          {isUploading && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          {L.BROWSE}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
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

      {activeTask && (
        <DocumentUploadFlowDialog
          key={activeTask.task_id}
          open={dialogOpen}
          projectId={projectId ?? ""}
          task={activeTask}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}

export { UploadDropzone };
