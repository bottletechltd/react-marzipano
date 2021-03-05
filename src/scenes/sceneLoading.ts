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

import Marzipano from 'marzipano'

import { SceneSpec } from '../types'
import { Scene, Viewer } from '../marzipano-types'


const defaultResolution = 5376
const defaultFov = Math.PI * 1 / 3
const defaultViewParams = { yaw: 0, pitch: 0, roll: 0, defaultFov }
const defaultViewLimiter = Marzipano.RectilinearView.limit.traditional(defaultResolution, defaultFov)
const defaultLevels = [
  { width: defaultResolution }
]


const loadScene = (viewer: Viewer) => (sceneSpec: SceneSpec) => {
  const { imageUrl, type } = sceneSpec

  const levels = sceneSpec.levels ?? defaultLevels

  const viewParams = sceneSpec.viewParams ?? defaultViewParams
  const viewLimiter = sceneSpec.viewLimiter ?? defaultViewLimiter
  const view = new Marzipano.RectilinearView(viewParams, viewLimiter)

  const geometry = type === 'equirect'
    ? new Marzipano.EquirectGeometry(levels)
    : new Marzipano.CubeGeometry(levels)
  const source = typeof imageUrl === 'function'
    ? new Marzipano.ImageUrlSource(imageUrl)
    : Marzipano.ImageUrlSource.fromString(imageUrl)

  return viewer.createScene({ source, geometry, view })
}

const unloadScene = (viewer: Viewer) => (scene: Scene) => {
  viewer.destroyScene(scene)
}

type OnLoadFunc = () => void

let currentListener: OnLoadFunc | null = null

function switchScene(viewer: Viewer, scene: Scene, transitionDuration?: number, onLoad?: OnLoadFunc) {
  if (viewer && scene) {
    if (onLoad) {
      if (currentListener) {
        viewer.stage().removeEventListener('renderComplete', currentListener)
      }
      currentListener = onLoad
      viewer.stage().addEventListener('renderComplete', onLoad)
    }

    scene.switchTo({ transitionDuration })
  }
}
export { loadScene, unloadScene, switchScene, OnLoadFunc }
