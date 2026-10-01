import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buildSeed } from "@/content/seed";
import { schemaByCollection } from "@/content/schema";
import { applyImportPlan, loadExistingContent } from "./adminContent";
import { buildImportPlan, pendingItems, type ImportPlan, type PlanStatus } from "./importPlan";
import { useAdminT } from "./adminStrings";

type Loaded = Awaited<ReturnType<typeof loadExistingContent>>;

type State =
  | { step: "idle" }
  | { step: "loading" }
  | { step: "preview"; plan: ImportPlan; existing: Loaded }
  | { step: "writing"; plan: ImportPlan; existing: Loaded }
  | { step: "done"; written: number }
  | { step: "error"; message: string };

// Every seed doc must pass the same schema the public refresh uses.
const validatedSeed = () => {
  const seed = buildSeed();
  for (const { collection, doc } of seed) {
    schemaByCollection[collection].parse(doc);
  }
  return seed;
};

const statusOrder: PlanStatus[] = ["new", "changed", "unchanged"];

// Owner-only: writes the hard-coded seed to Firestore after a dry-run diff.
const SeedImport = () => {
  const t = useAdminT();
  const [state, setState] = useState<State>({ step: "idle" });

  const preview = async () => {
    setState({ step: "loading" });
    try {
      const seed = validatedSeed();
      const existing = await loadExistingContent();
      setState({ step: "preview", plan: buildImportPlan(seed, existing.docs), existing });
    } catch (error) {
      setState({ step: "error", message: error instanceof Error ? error.message : String(error) });
    }
  };

  const write = async (plan: ImportPlan, existing: Loaded) => {
    setState({ step: "writing", plan, existing });
    try {
      const written = await applyImportPlan(plan, existing.docs, existing.settings);
      setState({ step: "done", written });
    } catch (error) {
      setState({ step: "error", message: error instanceof Error ? error.message : String(error) });
    }
  };

  const plan = state.step === "preview" || state.step === "writing" ? state.plan : null;
  const pending = plan ? pendingItems(plan) : [];

  return (
    <section aria-labelledby="seed-import-title" className="space-y-4 text-left">
      <div className="space-y-1">
        <h2 id="seed-import-title" className="heading-card">
          {t("seedTitle")}
        </h2>
        <p className="body-text">{t("seedIntro")}</p>
      </div>

      <div role="status" aria-live="polite" className="body-text">
        {state.step === "loading" && t("seedLoading")}
        {state.step === "writing" && t("seedWriting")}
        {state.step === "done" && `${t("seedDone")} ${state.written}`}
      </div>
      {state.step === "error" && (
        <p role="alert" className="text-destructive">
          {t("seedError")} {state.message}
        </p>
      )}

      {plan && (
        <div className="space-y-3">
          <p className="body-text">
            {statusOrder
              .map(
                (status) =>
                  `${t(`seedStatus.${status}`)}: ${plan.items.filter((item) => item.status === status).length}`,
              )
              .join(" · ")}
            {plan.untouched.length > 0 &&
              ` · ${t("seedUntouched")}: ${plan.untouched.length}`}
          </p>
          {pending.length > 0 && (
            <ul className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-border p-3 text-sm">
              {pending.map((item) => (
                <li key={`${item.collection}/${item.id}`}>
                  <span className="font-medium">{t(`seedStatus.${item.status}`)}</span>{" "}
                  <code>
                    {item.collection}/{item.id}
                  </code>
                  {item.changedFields.length > 0 && ` (${item.changedFields.join(", ")})`}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={preview}
          disabled={state.step === "loading" || state.step === "writing"}
        >
          {t("seedPreview")}
        </Button>
        {plan && (
          <Button
            type="button"
            onClick={() => state.step === "preview" && write(state.plan, state.existing)}
            disabled={state.step !== "preview" || pending.length === 0}
          >
            {pending.length > 0 ? `${t("seedWrite")} (${pending.length})` : t("seedNothing")}
          </Button>
        )}
      </div>
    </section>
  );
};

export default SeedImport;
