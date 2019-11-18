import React from 'react'
import ReactDOM from 'react-dom'


const createHotspot = hotspotContainer => (element) => {
  const { transform, ...otherProps } = element.props
  if (hotspotContainer) {
    const rootElement = document.createElement('div')

    const { yaw, pitch, radius } = transform.coords
    const opts = { perspective: { radius } }

    const hotspot = hotspotContainer.createHotspot(rootElement, { yaw, pitch }, opts)

    ReactDOM.render(React.cloneElement(element, otherProps), hotspot.domElement())

    hotspot.show()

    return hotspot
  }
  return null
}

const destroyHotspot = hotspotContainer => (hotspot) => {
  hotspotContainer.destroyHotspot(hotspot)
}

export { createHotspot, destroyHotspot }
