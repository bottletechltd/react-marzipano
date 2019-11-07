import { useEffect, useReducer, useState } from 'react'
import Marzipano from 'marzipano'


function sceneFromFilepath(viewer, filepath, type, levels, view) {
  const geometry = type === 'equirect' ? new Marzipano.EquirectGeometry(levels) :
    new Marzipano.CubeGeometry(levels)
  const source = Marzipano.ImageUrlSource.fromString(filepath)
  return viewer.createScene({ source, geometry, view })
}

const defaultResolution = 5376
const defaultFov = Math.PI * 1 / 3
const defaultViewParams = { yaw: 0, pitch: 0, roll: 0, defaultFov }
const defaultViewLimiter = Marzipano.RectilinearView.limit.traditional(defaultResolution, defaultFov)
const defaultLevels = [
  { width: defaultResolution }
]

function loadScene (viewer, sceneSpec) {
  const { filepath, type, prefix } = sceneSpec

  const levels = sceneSpec.levels || defaultLevels

  const viewParams = sceneSpec.viewParams || defaultViewParams
  const viewLimiter = sceneSpec.viewLimiter || defaultViewLimiter
  const view = new Marzipano.RectilinearView(viewParams, viewLimiter)

  return sceneFromFilepath(viewer, filepath, type, levels, view)
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
  const [loadedScenes, setLoadedScenes] = useState({})
  const [currentScene, setCurrentScene] = useState(null)
  const [renderCompleteListener, dispatchRenderCompleteListener] =
    useReducer((state, newListener) => {
      return { previous: state.current, current: newListener }
    }, { previous: null, current: null })
  useEffect(() => {
    if (viewer && scenesToLoad) {
      const stage = viewer.stage()
      for (const [sceneId, sceneSpec] of Object.entries(scenesToLoad)) {
        if (!loadedScenes[sceneId]) {
          const newScene = loadScene(viewer, sceneSpec)
          setLoadedScenes({ ...loadedScenes, sceneId: newScene })

          if (currentSceneId === sceneId) {
            setCurrentScene(newScene)
            const newListener = makeOnRenderCompleteListener(viewer, sceneSpec.onLoad)
            dispatchRenderCompleteListener(newListener)
          }
        }
      }
    }

    return () => {
      if (viewer && scenesToLoad) {
        for (const [sceneId, scene] of Object.entries(loadedScenes)) {
          if (!scenesToLoad[sceneId]) {
            viewer.destroyScene(scene)
          }
        }
      }
    }
  }, [viewer, scenesToLoad])

  // Switch to a new currentScene if it was set in above effect
  useEffect(() => {
    if (viewer && currentScene) {
      currentScene.switchTo({ transitionDuration })
    }
  }, [viewer, currentScene])

  // Handle adding a new listener to stage if it was set above
  useEffect(() => {
    if (viewer && viewer.stage()) {
      viewer.stage().addEventListener('renderComplete', renderCompleteListener.current)
    }
    return () => {
      if (viewer) {
        viewer.stage().removeEventListener('renderComplete', renderCompleteListener.previous)
      }
    }
  }, [viewer, renderCompleteListener])

  return currentScene
}

export default useSceneLoader
