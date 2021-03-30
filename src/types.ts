import React from 'react'


export type Container<T> = Array<T> | Map<string, T> | Record<string, T>

export interface KeyedData {
  key?: string,
}

export interface SceneSpec extends KeyedData {
  isCurrent?: any,
  hotspots: Container<HotspotSpec>,
  imageUrl: string,
  type: string,
  levels?: any,
  viewParams?: any,
  viewLimiter?: any,
}

export interface HotspotSpec extends KeyedData {
  element: React.ReactElement
}
