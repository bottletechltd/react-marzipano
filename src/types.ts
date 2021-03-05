export interface SceneSpec {
  key: string,
  imageUrl: string,
  type: string,
  levels?: any,
  viewParams?: any,
  viewLimiter?: any,
}

export interface HotspotSpec {
}

export interface MarzipanoProps {
  className?: string,
  style?: string,
  scenes: SceneSpec[],
  hotspots: HotspotSpec[],
}
