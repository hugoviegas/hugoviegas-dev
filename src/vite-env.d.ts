/// <reference types="vite/client" />

// Public Firebase web config, used only by the hidden admin page.
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

// Allow importing 3D model assets with .glb extension
declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.glb?url" {
  const src: string;
  export default src;
}
