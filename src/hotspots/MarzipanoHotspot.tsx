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

import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import useHotspotLoader from './useHotspotLoader'


/**
 * Internally used Hotspot component
 *
 * Doesn't actually render anything, but instead uses JS to create a div element to
 * hand off to Marzipano to manage.
 */
function MarzipanoHotspot(props) {
  const rootElement = useRef(document.createElement('div'))
  useHotspotLoader(props.hotspotContainer, props.transform, rootElement, props.children)

  return null
}

MarzipanoHotspot.propTypes = {
  viewer: PropTypes.object,
  transform: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

export default MarzipanoHotspot
