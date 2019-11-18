import { useEffect, useReducer, useState } from 'react'
import { produce } from 'immer'

import useObserveChanges from 'common/useObserveChanges'
import { isSceneSame, isScenePresent } from './isSameScene'
import { loadScene, unloadScene } from './sceneLoading'


function useScenes(viewer, inputScenes = []) {
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
  }, [viewer, deleted])

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
    if (updated.length > 0) {
      for (const key of updated) {
        if (scenesLookup.get(key).current && loadedScenes.has(key)) {
          loadedScenes.get(key).switchTo()
          setCurrentSceneKey(key)
        }
      }
    }
  }, [loadedScenes, scenesLookup, updated, deleted])

  return [loadedScenes, currentScene]
}

export default useScenes
