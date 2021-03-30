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
import { v4 as uuidv4 } from 'uuid'

import { Container, HotspotSpec } from '../types'
import { HotspotContainer, Hotspot } from '../marzipano-types'
import { createHotspot, destroyHotspot } from './hotspotLoading'


export interface UseHotspotsInput {
  hotspotContainer: HotspotContainer,
  hotspotSpecs: Container<HotspotSpec>,
}
export type UseHotspotsResult = Map<string, Hotspot>

type HotspotsCacheAction = 
  | { type: 'ADD', key: string, hotspot: Hotspot }
  | { type: 'DELETE', key: string }

/**
 * Creates marzipano hotspots in the given HotspotContainer
 */
function useHotspots(input?: UseHotspotsInput): UseHotspotsResult {
  const [hotspotsCache, dispatchHotspotsCache] = useReducer((state: Map<string, Hotspot>, action: HotspotsCacheAction) => {
    return produce(state, draftHotspotsCache => {
      switch (action.type) {
        case 'ADD':
          draftHotspotsCache.set(action.key, action.hotspot)
        case 'DELETE':
          draftHotspotsCache.delete(action.key)
      }
    })
  }, new Map<string, Hotspot>())

  useEffect(() => {
    if (input !== undefined) {
      const { hotspotContainer, hotspotSpecs } = input
      let hotspotSpecsAsMap = null
      if (hotspotSpecs instanceof Map) {
        hotspotSpecsAsMap = hotspotSpecs
      } else if (hotspotSpecs instanceof Array) {
        hotspotSpecsAsMap = new Map(hotspotSpecs.map((data) => {
          const key = data.key ?? uuidv4()
          return [key, data]
        }))
      } else {
        hotspotSpecsAsMap = new Map(Object.entries(hotspotSpecs))
      }

      for (const [key, hotspot] of hotspotsCache.entries()) {
        if (!hotspotSpecsAsMap.has(key)) {
          destroyHotspot(hotspotContainer, hotspot)
          dispatchHotspotsCache({ type: 'DELETE', key })
        }
      }

      for (const [key, hotspotSpec] of hotspotSpecsAsMap.entries()) {
        if (!hotspotsCache.has(key)) {
          const hotspot = createHotspot(hotspotContainer, hotspotSpec.element)
          dispatchHotspotsCache({ type: 'ADD', key, hotspot })
        }
      }
    }
  }, [input])

  return hotspotsCache
}

export default useHotspots
