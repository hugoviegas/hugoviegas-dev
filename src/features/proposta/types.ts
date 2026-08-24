import type { ComponentType } from "react";

export type SlideAccent =
  | "iris"
  | "mint"
  | "azure"
  | "sunrise"
  | "amber"
  | "violet"
  | "magenta";

export interface SlideDefinition {
  id: string;
  title: string;
  accent: SlideAccent;
  Component: ComponentType;
}
