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

import { useEffect, useMemo, useReducer, useState } from 'react'
import { produce } from 'immer'
import { v4 as uuidv4 } from 'uuid'

import { Container, SceneSpec } from '../types'
import { Hotspot, Scene, Viewer } from '../marzipano-types'
import { loadScene, unloadScene, switchScene } from './sceneLoading'
import useHotspots, { UseHotspotsInput } from '../hotspots/useHotspots'


type SceneCacheAction =
  | { type: 'ADD', key: string, scene: Scene }
  | { type: 'DELETE', key: string }
  | { type: 'DELETEALL' }

export type UseScenesResult = [Map<string, Scene>, Map<string, Hotspot>]

function useScenes(viewer: Viewer | null, inputScenes: Container<SceneSpec> = [], currentSceneKey?: string, sceneTransitionDuration?: number): UseScenesResult {
  const inputScenesAsMap = useMemo<Map<string, SceneSpec>>(() => {
    if (inputScenes instanceof Map) {
      return inputScenes
    }
    if (inputScenes instanceof Array) {
      return new Map(inputScenes.map((sceneSpec) => {
        const key = sceneSpec.key ?? uuidv4()
        return [key, sceneSpec]
      }))
    }
    return new Map(Object.entries(inputScenes))
  }, [inputScenes])
  const [sceneCache, dispatchToSceneCache] = useReducer((state: Map<string, Scene>, action: SceneCacheAction) => {
    return produce(state, draftSceneCache => {
      switch (action.type) {
        case 'ADD':
          draftSceneCache.set(action.key, action.scene)
          break
        case 'DELETE':
          draftSceneCache.delete(action.key)
          break
        case 'DELETEALL':
          draftSceneCache.clear()
          break
      }
    })
  }, new Map<string, Scene>())
  const [useHotspotsInput, setUseHotspotsInput] = useState<UseHotspotsInput | undefined>(undefined)

  useEffect(() => {
    if (viewer === null) return
    for (const [key, scene] of sceneCache.entries()) {
      if (!inputScenesAsMap.has(key)) {
        unloadScene(viewer, scene)
        dispatchToSceneCache({ type: 'DELETE', key })
      }
    }
    for (const [key, sceneSpec] of inputScenesAsMap.entries()) {
      let scene = sceneCache.get(key)
      if (scene === undefined) {
        scene = loadScene(viewer, sceneSpec)
        dispatchToSceneCache({ type: 'ADD', key, scene })
      }
      if (currentSceneKey !== undefined && currentSceneKey === key ||
          currentSceneKey === undefined && sceneSpec.isCurrent !== undefined) {
        switchScene(viewer, scene, sceneTransitionDuration)
        setUseHotspotsInput({
          hotspotContainer: scene.hotspotContainer(),
          hotspotSpecs: sceneSpec.hotspots,
        })
      }
    }
  }, [viewer, inputScenes])

  const hotspotCache = useHotspots(useHotspotsInput)

  return [sceneCache, hotspotCache]
}

export default useScenes
