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
  const { imageUrl, type, prefix } = sceneSpec

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
    console.log('render complete')
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
  const [onLoadListeners, setOnLoadListeners] = useState({})
  useEffect(() => {
    if (viewer && scenesToLoad) {
      const stage = viewer.stage()

      let newScenes = {}
      for (const [sceneId, sceneSpec] of Object.entries(scenesToLoad)) {
        if (!loadedScenes[sceneId]) {
          const newScene = loadScene(viewer, sceneSpec)
          newScenes = { ...newScenes, [sceneId]: { scene: newScene, onLoad: sceneSpec.onLoad } }
        }
      }
      setLoadedScenes(newScenes)
    }

    return () => {
      if (viewer && scenesToLoad) {
        let remainingScenes = {}
        for (const [sceneId, loadedScene] of Object.entries(loadedScenes)) {
          if (!scenesToLoad[sceneId]) {
            viewer.destroyScene(loadedScene.scene)
          } else {
            remainingScenes = { ...remainingScenes, [sceneId]: loadedScene }
          }
        }
        setLoadedScenes(remainingScenes)
      }
    }
  }, [viewer, scenesToLoad])

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
  }, [viewer, currentSceneId, loadedScenes, onLoadListeners])

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

  return loadedScenes
}

export default useSceneLoader
