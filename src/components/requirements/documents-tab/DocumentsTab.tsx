import { Loader2 } from "lucide-react";

import { LABELS } from "@/constants/labels";
import { useProject } from "@/contexts/useProject";
import { useDocuments } from "@/hooks/requirements/queries";
import { getErrorMessage } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DocumentRow } from "./DocumentRow";
import { UploadDropzone } from "./UploadDropzone";

import {
  toRequirementDocument,
  type DocumentResponse,
} from "@/types/requirements";

const L = LABELS.REQUIREMENTS.DOCUMENTS;
const STATE_L = LABELS.REQUIREMENTS.STATE;

interface DocumentsTableProps {
  isLoading: boolean;
  errorMessage: string | null;
  documents: DocumentResponse[];
  projectId: string | undefined;
}

function DocumentsTable({
  isLoading,
  errorMessage,
  documents,
  projectId,
}: DocumentsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2
          className="size-5 animate-spin text-slate-400"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm font-medium text-red-500">{errorMessage}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-slate-500">{STATE_L.DOCUMENTS_EMPTY}</p>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white">
          <TableRow>
            <TableHead>{L.COLUMN_FILE}</TableHead>
            <TableHead>{L.COLUMN_TYPE}</TableHead>
            <TableHead>{L.COLUMN_UPLOADED}</TableHead>
            <TableHead>{L.COLUMN_STATUS}</TableHead>
            <TableHead>{L.COLUMN_ACTION}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <DocumentRow
              key={document.id}
              document={toRequirementDocument(document)}
              projectId={projectId}
              documentId={document.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/** Documents tab — upload dropzone plus the processed-documents table. */
function DocumentsTab() {
  const { projectId } = useProject();
  const {
    data: documents,
    isLoading,
    isError,
    error,
  } = useDocuments(projectId);

  const errorMessage = isError
    ? getErrorMessage(error, STATE_L.DOCUMENTS_ERROR)
    : null;

  return (
    <div className="space-y-4">
      <UploadDropzone projectId={projectId} />
      <Card className="py-0">
        <CardContent className="px-0">
          <DocumentsTable
            isLoading={isLoading}
            errorMessage={errorMessage}
            documents={documents ?? []}
            projectId={projectId}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export { DocumentsTab };
