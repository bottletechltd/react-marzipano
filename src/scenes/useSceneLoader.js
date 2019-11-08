import { useEffect, useReducer, useState } from 'react'
import Marzipano from 'marzipano'


const defaultResolution = 5376
const defaultFov = Math.PI * 1 / 3
const defaultViewParams = { yaw: 0, pitch: 0, roll: 0, defaultFov }
const defaultViewLimiter = Marzipano.RectilinearView.limit.traditional(defaultResolution, defaultFov)
const defaultLevels = [
  { width: defaultResolution }
]

function loadScene (viewer, sceneSpec) {
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

function makeOnRenderCompleteListener (viewer, onLoadListener) {
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

function useSceneLoader(viewer, scenesToLoad, currentSceneId, transitionDuration = 1000) {
  // Check parameters are correct
  useEffect(() => {
    if (!viewer && scenesToLoad && scenesToLoad.length > 0) {
      throw TypeError('Viewer must be provided to load scenesToLoad')
    }
  }, [viewer, scenesToLoad])

  // Loads any new scenes passed in, and handles their clean up when they are
  // not referenced anymore
  const [loadedScenes, dispatchLoadedScenes] = useReducer((state, action) => {
    switch (action.type) {
      case 'ADD':
        return { ...state, [action.sceneId]: { scene: action.scene, onLoad: action.onLoad } }
      case 'REMOVE':
        const { [action.sceneId]: _, ...remaining } = state
        return remaining
      default:
        return state
    }
  }, {})
  useEffect(() => {
    if (viewer && scenesToLoad) {
      for (const [sceneId, sceneSpec] of Object.entries(scenesToLoad)) {
        if (!loadedScenes[sceneId]) {
          const newScene = loadScene(viewer, sceneSpec)
          dispatchLoadedScenes({ type: 'ADD', sceneId, scene: newScene, onLoad: sceneSpec.onLoad })
        }
      }
    }

    return () => {
      if (viewer && scenesToLoad) {
        for (const [sceneId, loadedScene] of Object.entries(loadedScenes)) {
          if (!scenesToLoad[sceneId]) {
            viewer.destroyScene(loadedScene.scene)
            dispatchLoadedScenes({ type: 'REMOVE', sceneId })
          }
        }
      }
    }
  }, [viewer, scenesToLoad, loadedScenes])

  // Switch to a new currentScene if it was set in above effect
  // Also dispatch a onRenderComplete listener for when the scene has been rendered
  const [renderCompleteListener, dispatchRenderCompleteListener] =
    useReducer((state, newListener) => {
      return { previous: state.current, current: newListener }
    }, { previous: null, current: null })
  useEffect(() => {
    if (viewer && currentSceneId && loadedScenes[currentSceneId]) {
      const toLoad = loadedScenes[currentSceneId]
      toLoad.scene.switchTo({ transitionDuration })
      const newListener = makeOnRenderCompleteListener(viewer, toLoad.onLoad)
      dispatchRenderCompleteListener(newListener)
    }
  }, [viewer, currentSceneId, loadedScenes, transitionDuration])

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

  return Object.fromEntries(
    Object.entries(loadedScenes).map(
      ([sceneId, { scene }]) => [sceneId, scene]))
}

export default useSceneLoader
