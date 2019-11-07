import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import useHotspotLoader from './useHotspotLoader'


/**
 * Internally used Hotspot component
 *
 * This is the div that is actually rendered and handed off to
 * Marzipano to contain a user Hotspot.
 */
function MarzipanoHotspot(props) {
  const rootElement = useRef(null)
  useHotspotLoader(props.hotspotContainer, props.transform, rootElement, props.children)

  return <div ref={rootElement}></div>
}

MarzipanoHotspot.propTypes = {
  viewer: PropTypes.object,
  transform: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

export default MarzipanoHotspot
