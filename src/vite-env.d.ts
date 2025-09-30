/// <reference types="vite/client" />

// Allow importing 3D model assets with .glb extension
declare module "*.glb" {
  const src: string;
  export default src;
}
