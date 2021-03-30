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

import React from 'react'
import ReactDOM from 'react-dom'

import { HotspotContainer, Hotspot } from '../marzipano-types'


function createHotspot(hotspotContainer: HotspotContainer, element: React.ReactElement): Hotspot {
  const { transform, ...otherProps } = element.props

  const rootElement = document.createElement('div')

  const { yaw, pitch, radius } = transform.coords
  const opts = { perspective: { radius } }

  const hotspot = hotspotContainer.createHotspot(rootElement, { yaw, pitch }, opts)

  ReactDOM.render(React.cloneElement(element, otherProps), hotspot.domElement())

  hotspot.show()

  return hotspot
}

function destroyHotspot(hotspotContainer: HotspotContainer, hotspot: Hotspot) {
  hotspotContainer.destroyHotspot(hotspot)
}

export { createHotspot, destroyHotspot }
