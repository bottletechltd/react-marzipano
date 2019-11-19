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
import Marzipano from 'marzipano'


const defaultResolution = 5376
const defaultFov = Math.PI * 1 / 3
const defaultViewParams = { yaw: 0, pitch: 0, roll: 0, defaultFov }
const defaultViewLimiter = Marzipano.RectilinearView.limit.traditional(defaultResolution, defaultFov)
const defaultLevels = [
  { width: defaultResolution }
]


const loadScene = viewer => sceneSpec => {
  const { imageUrl, type } = sceneSpec

  const levels = sceneSpec.levels || defaultLevels

  const viewParams = sceneSpec.viewParams || defaultViewParams
  const viewLimiter = sceneSpec.viewLimiter || defaultViewLimiter
  const view = new Marzipano.RectilinearView(viewParams, viewLimiter)

  const geometry = type === 'equirect'
    ? new Marzipano.EquirectGeometry(levels)
    : new Marzipano.CubeGeometry(levels)
  const source = typeof imageUrl === 'function'
    ? new Marzipano.ImageUrlSource(imageUrl)
    : Marzipano.ImageUrlSource.fromString(imageUrl)

  return viewer.createScene({ source, geometry, view })
}

const unloadScene = viewer => scene => {
  viewer.destroyScene(scene)
}

function useLoadScenes(viewer, scenesToLoad) {
  // Tracks scenes which we have loaded into the viewer so far.
  const [loadedScenes, dispatchLoadedScenes] = useReducer((state, action) => {
    switch (action.type) {
      case 'ADD':
        return { ...state, [action.sceneId]: action.marzipanoScene }
      case 'REMOVE': {
        const { [action.sceneId]: _, ...remaining } = state
        return remaining
      }
      default:
        return state
    }
  }, {})

  const [currentSceneId, setCurrentSceneId] = useState(null)

  // Loads any new scenes passed in, and handles their clean up when they are
  // not referenced anymore
  useEffect(() => {
    if (viewer && scenesToLoad) {
      for (const sceneSpec of scenesToLoad) {
        const sceneId = sceneSpec.id
        if (!loadedScenes[sceneId]) {
          const marzipanoScene = loadScene(viewer)(sceneSpec)
          dispatchLoadedScenes({ type: 'ADD', sceneId, marzipanoScene })
        }
        if (sceneSpec.current) {
          setCurrentSceneId(sceneId)
        }
      }
    }

    return () => {
      if (viewer && scenesToLoad) {
        for (const [sceneId, loadedScene] of Object.entries(loadedScenes)) {
          if (scenesToLoad.findIndex(sceneToLoad => sceneToLoad.id !== sceneId)) {
            unloadScene(viewer)(loadedScene.scene)
            dispatchLoadedScenes({ type: 'REMOVE', sceneId })
          }
        }
      }
    }
  }, [viewer, scenesToLoad, loadedScenes])


  // Tracks which scene is set to be the "current scene to display"
  const [current, setCurrent] = useState({ scene: null, onLoad: null })

  useEffect(() => {
    const currentLoadedScene = loadedScenes[currentSceneId]
    const currentSceneSpec = scenesToLoad[currentSceneId]
    if (currentLoadedScene) {
      const current = currentSceneSpec && currentSceneSpec.onLoad ?
        { scene: currentLoadedScene, onLoad: currentSceneSpec.onLoad } :
        { scene: currentLoadedScene }
      setCurrent(current)
    }
  }, [loadedScenes, scenesToLoad, currentSceneId])

  return { current, loadedScenes }
}


function useSwitchScene(viewer, { scene }, transitionDuration) {
  useEffect(() => {
    if (viewer && scene) {
      scene.switchTo({ transitionDuration })
    }
  }, [viewer, scene, transitionDuration])
}


function makeOnRenderCompleteListener(viewer, onLoadListener) {
  return function onRenderComplete(stable) {
    if (stable) {
      if (onLoadListener) {
        onLoadListener()
      }
      viewer.updateSize()
      viewer.stage().removeEventListener('renderComplete', onRenderComplete)
    }
  }
}

function useOnRenderScene(viewer, { onLoad }) {
  const [renderCompleteListener, setRenderCompleteListener] =
    useReducer((state, newListener) => {
      return { previous: state.current, current: newListener }
    }, { previous: null, current: null })

  // Dispatch a new listener when provided one through onLoad
  useEffect(() => {
    if (viewer && onLoad) {
      const newListener = makeOnRenderCompleteListener(viewer, onLoad)
      dispatchRenderCompleteListener(newListener)
    }
  }, [viewer, onLoad])

  // Handle adding a new listener to stage if it was set above
  useEffect(() => {
    if (viewer && viewer.stage() && renderCompleteListener.current) {
      viewer.stage().addEventListener('renderComplete', renderCompleteListener.current)
    }
    return () => {
      if (viewer && renderCompleteListener.previous) {
        console.log('removing listener (on cleanup)')
        viewer.stage().removeEventListener('renderComplete', renderCompleteListener.previous)
      }
    }
  }, [viewer, renderCompleteListener])
}


function useSceneLoader(viewer, scenesToLoad, transitionDuration = 1000) {
  // Check parameters are correct
  useEffect(() => {
    if (!viewer && scenesToLoad && scenesToLoad.length > 0) {
      throw TypeError('Viewer must be provided to load scenesToLoad')
    }
  }, [viewer, scenesToLoad])

  const { current, loadedScenes } = useLoadScenes(viewer, scenesToLoad)

  // Switch to a new currentScene if it was set in above effect
  useSwitchScene(viewer, current, transitionDuration)

  useOnRenderScene(viewer, current)


  return Object.fromEntries(
    Object.entries(loadedScenes).map(
      ([sceneId, { scene }]) => [sceneId, scene]))
}

export default useSceneLoader
export { loadScene, unloadScene }
