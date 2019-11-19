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
