/**
 * MIT License
 *
 * Copyright (c) 2019 BottleTech Limited
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { useRef } from 'react'
import { Viewer } from 'marzipano'

import { SceneSpec, HotspotSpec } from './types'
import useViewer from './useViewer'
import { useScenes } from './scenes'
import { useHotspots } from './hotspots'


export interface ViewerOpts {
  controls?: {
    mouseViewMode?: 'drag' | 'qtvr',
    dragMode?: 'pan' | 'pinch',
    scrollZoom?: boolean,
  },
  stage?: {
    antialias?: boolean,
    preserveDrawingBuffer?: boolean,
    generateMipmaps?: boolean,
  },
  cursors?: {
    drag?: {
      active?: string,
      inactive?: string,
      disabled?: string,
    },
  },
}

export interface UseMarzipanoProps {
  viewerOpts: ViewerOpts,
  scenes: SceneSpec[],
  hotspots: HotspotSpec[],
}

export interface UseMarzipanoResult {
  viewerCanvas: React.RefObject<HTMLDivElement>,
  scenes: Scene[],
  hotspots: Hotspot[],
}

function useMarzipano({ viewerOpts, scenes: sceneSpecs, hotspots: hotspotSpecs }: UseMarzipanoProps): UseMarzipanoResult {
  const viewerCanvasRef = useRef<HTMLDivElement>(null)

  // Viewer initialization
  const viewer = new Viewer(viewerOpts)

  // Scene Loading
  const [scenes, currentScene] = useScenes(viewer, sceneSpecs)

  // Hotspot Loading
  const hotspotContainer = currentScene && currentScene.hotspotContainer ? currentScene.hotspotContainer() : null
  const hotspots = useHotspots(hotspotContainer, hotspotSpecs)

  return { viewerCanvas: viewerCanvasRef, scenes, hotspots }
}

export default useMarzipano
