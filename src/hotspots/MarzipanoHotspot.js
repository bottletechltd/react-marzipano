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
