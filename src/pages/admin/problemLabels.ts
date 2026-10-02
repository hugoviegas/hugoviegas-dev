import type { ContentCollection } from "@/content/types";
import { collectionDefs } from "./collectionConfig";
import type { PublishProblem } from "./editorModel";
import type { AdminStringKey } from "./adminStrings";

// "Title · PT-BR" for a publish problem, using the editor's field labels.
export const problemLabel = (t: (key: AdminStringKey) => string, collection: ContentCollection, problem: PublishProblem) => {
  const def = collectionDefs[collection];
  const field = [...def.localized, ...def.shared].find((item) => item.name === problem.field);
  const name = field ? t(field.label) : problem.field;
  const lang = problem.lang === "en" ? t("lang.en") : problem.lang === "ptBR" ? t("lang.pt") : null;
  const label = lang ? `${name} · ${lang}` : name;
  return problem.kind === "invalid" ? `${label} (${t("err.invalid").replace(/\.$/, "").toLowerCase()})` : label;
};
