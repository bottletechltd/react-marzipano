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

import { useEffect, useReducer, useState } from 'react'
import { produce } from 'immer'

import useObserveChanges from 'common/useObserveChanges'
import { isSceneSame, isScenePresent } from './isSameScene'
import { loadScene, unloadScene, switchScene } from './sceneLoading'


function useScenes(viewer, inputScenes = [], onLoad = null) {
  const [scenesLookup, added, updated, deleted] = useObserveChanges(inputScenes, isScenePresent, isSceneSame)
  const [loadedScenes, dispatchLoadedScene] = useReducer((state, action) => {
    switch (action.type) {
      case 'ADD':
        return produce(state, draftLoadedScenes => {
          draftLoadedScenes.set(action.key, action.scene)
        })
      case 'DELETE':
        return produce(state, draftLoadedScenes => {
          draftLoadedScenes.delete(action.key)
        })
      default:
        return state
    }
  }, new Map())
  const [currentSceneKey, setCurrentSceneKey] = useState(null)
  const currentScene = currentSceneKey && loadedScenes.has(currentSceneKey) ? loadedScenes.get(currentSceneKey) : null

  useEffect(() => {
    if (viewer && deleted.length > 0) {
      for (const key of deleted) {
        unloadScene(viewer)(loadedScenes.get(key))
        dispatchLoadedScene({ type: 'DELETE', key })
      }
    }
  }, [viewer, loadedScenes, deleted])

  // Load scenes when they are first added to spec
  useEffect(() => {
    if (viewer && added.length > 0) {
      for (const key of added) {
        const sceneSpec = scenesLookup.get(key)
        const scene = loadScene(viewer)(sceneSpec)
        dispatchLoadedScene({ type: 'ADD', key, scene })
        if (sceneSpec.current) {
          setCurrentSceneKey(null)
        }
      }
    }
  }, [viewer, scenesLookup, added])

  useEffect(() => {
    if (viewer && updated.length > 0) {
      for (const key of updated) {
        if (scenesLookup.get(key).current && loadedScenes.has(key)) {
          const scene = loadedScenes.get(key)
          switchScene(viewer, scene)
          setCurrentSceneKey(key)
        }
      }
    }
  }, [loadedScenes, scenesLookup, updated, deleted, onLoad, viewer])

  return [loadedScenes, currentScene]
}

export default useScenes
