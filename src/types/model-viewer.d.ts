declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": {
      src?: string;
      alt?: string;
      "auto-rotate"?: boolean | string;
      "camera-controls"?: boolean | string;
      style?: Partial<CSSStyleDeclaration>;
      [key: string]: unknown;
    };
  }
}
