import { Plus, Trash2 } from "lucide-react";

import { MermaidDiagram } from "@/components/common/mermaid-diagram/mermaid-diagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LABELS } from "@/constants/labels";

import type { ArchitectureOverview as ArchitectureOverviewData } from "@/types/proposal";

const { ARCHITECTURE, EDIT } = LABELS.PROPOSAL;

const EMPTY_COMPONENT = { name: "", purpose: "", technology: "" };

interface ArchitectureOverviewProps {
  readonly architecture: ArchitectureOverviewData | null;
  readonly isEditing?: boolean;
  readonly onChange?: (architecture: ArchitectureOverviewData) => void;
}

/** Proposed architecture: rationale paragraph plus a grid of its components. */
function ArchitectureOverview({
  architecture,
  isEditing = false,
  onChange,
}: ArchitectureOverviewProps) {
  const current: ArchitectureOverviewData = architecture ?? {
    rationale: "",
    components: [],
    diagramMermaid: "",
  };

  if (isEditing) {
    const setRationale = (rationale: string) =>
      onChange?.({ ...current, rationale });

    const updateComponent = (
      index: number,
      patch: Partial<ArchitectureOverviewData["components"][number]>,
    ) =>
      onChange?.({
        ...current,
        components: current.components.map((component, componentIndex) =>
          componentIndex === index ? { ...component, ...patch } : component,
        ),
      });

    const removeComponent = (index: number) =>
      onChange?.({
        ...current,
        components: current.components.filter(
          (_, componentIndex) => componentIndex !== index,
        ),
      });

    const addComponent = () =>
      onChange?.({
        ...current,
        components: [...current.components, { ...EMPTY_COMPONENT }],
      });

    return (
      <div className="space-y-4">
        <Textarea
          value={current.rationale}
          onChange={(event) => setRationale(event.target.value)}
          placeholder={EDIT.ARCHITECTURE_RATIONALE_LABEL}
          rows={3}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {current.components.map((component, index) => (
            <div key={index} className="space-y-2 rounded-xl bg-slate-50 p-4">
              <div className="flex items-start gap-2">
                <Input
                  value={component.name}
                  onChange={(event) =>
                    updateComponent(index, { name: event.target.value })
                  }
                  placeholder={EDIT.ARCHITECTURE_COMPONENT_NAME_PLACEHOLDER}
                  className="font-semibold"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeComponent(index)}
                  aria-label={EDIT.REMOVE_ROW_ARIA}
                  className="shrink-0 text-slate-400 hover:text-red-600"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
              <Input
                value={component.technology}
                onChange={(event) =>
                  updateComponent(index, { technology: event.target.value })
                }
                placeholder={EDIT.ARCHITECTURE_COMPONENT_TECHNOLOGY_PLACEHOLDER}
                className="text-xs font-medium text-indigo-600"
              />
              <Textarea
                value={component.purpose}
                onChange={(event) =>
                  updateComponent(index, { purpose: event.target.value })
                }
                placeholder={EDIT.ARCHITECTURE_COMPONENT_PURPOSE_PLACEHOLDER}
                rows={2}
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addComponent}
        >
          <Plus aria-hidden="true" />
          {EDIT.ADD_COMPONENT}
        </Button>
      </div>
    );
  }

  if (!architecture) {
    return <p className="text-sm text-slate-500">{ARCHITECTURE.EMPTY}</p>;
  }

  return (
    <div className="space-y-4">
      {architecture.rationale && (
        <p className="leading-relaxed text-slate-700">
          {architecture.rationale}
        </p>
      )}
      {architecture.diagramMermaid && (
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">
            {ARCHITECTURE.DIAGRAM_LABEL}
          </p>
          <MermaidDiagram
            chart={architecture.diagramMermaid}
            ariaLabel={ARCHITECTURE.DIAGRAM_ARIA}
            errorMessage={ARCHITECTURE.DIAGRAM_ERROR}
          />
        </div>
      )}
      {architecture.components.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {architecture.components.map((component) => (
            <div key={component.name} className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {component.name}
              </p>
              {component.technology && (
                <p className="mt-0.5 text-xs font-medium text-indigo-600">
                  {component.technology}
                </p>
              )}
              {component.purpose && (
                <p className="mt-2 text-sm text-slate-600">
                  {component.purpose}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { ArchitectureOverview };
