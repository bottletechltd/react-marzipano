interface View {
}

interface Source {
}

interface Geometry {
}

interface CreateSceneOpts {
  view: View,
  source: Source,
  geometry: Geometry,
  pinFirstLevel?: boolean,
  textureStoreOpts?: any,
  layerOpts?: any,
}

interface SwitchSceneOpts {
  transitionDuration?: number,
  transitionUpdate?: number,
}

type Stage = EventTarget & {
}

export interface Scene {
  switchTo(opts: SwitchSceneOpts): void;
}

export interface Viewer {
  createScene(opts: CreateSceneOpts): Scene,
  stage(): Stage,
  destroy(): void,
  destroyScene(scene: Scene): void,
}
