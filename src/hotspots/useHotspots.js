import { useEffect, useReducer } from 'react'
import { produce } from 'immer'

import useObserveChanges from 'common/useObserveChanges'
import isSameHotspot from './isSameHotspot'
import { createHotspot, destroyHotspot } from './hotspotLoading'


/**
 * Creates marzipano hotspots in the given HotspotContainer
 */
function useHotspots(hotspotContainer, hotspotSpecs = []) {
  const [hotspotLookup, added, , deleted] = useObserveChanges(hotspotContainer ? hotspotSpecs : [], isSameHotspot)
  const [loadedHotspots, dispatchHotspots] = useReducer((currentHotspots, action) => {
    switch (action.type) {
      case 'ADD':
        return produce(currentHotspots, draftLoadedHotspots => {
          draftLoadedHotspots.set(action.key, action.hotspot)
        })
      case 'DELETE':
        return produce(currentHotspots, draftLoadedHotspots => {
          draftLoadedHotspots.delete(action.key)
        })
      default:
        return currentHotspots
    }
  }, new Map())

  useEffect(() => {
    if (hotspotContainer && added.length > 0) {
      for (const key of added) {
        const newHotspot = createHotspot(hotspotContainer)(hotspotLookup.get(key))
        dispatchHotspots({ type: 'ADD', key, hotspot: newHotspot })
      }
    }
  }, [hotspotContainer, added])

  useEffect(() => {
    if (hotspotContainer && deleted.length > 0) {
      for (const key of deleted) {
        destroyHotspot(hotspotContainer)(loadedHotspots.get(key))
        dispatchHotspots({ type: 'DELETE', key })
      }
    }
  }, [hotspotContainer, deleted])

  return hotspotLookup
}

export default useHotspots
