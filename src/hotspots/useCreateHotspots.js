import ReactDOM from 'react-dom'
import React, { useEffect, useState } from 'react'


function createHotspot({ hotspotContainer, transform, children }) {
  if (hotspotContainer && transform && children) {
    const rootElement = document.createElement('div')

    const { yaw, pitch, radius } = transform.coords
    const opts = { perspective: { radius } }

    const hotspot = hotspotContainer.createHotspot(rootElement.current, { yaw, pitch }, opts)

    React.Children.forEach(children, child => {
      ReactDOM.render(child, hotspot.current.domElement())
    })

    hotspot.current.show()

    return hotspot
  }
  return null
}

/**
 * Creates marzipano hotspots in the given HotspotContainer
 */
function useCreateHotspots(hotspotContainer, hotspotSpecs, children) {
  const [hotspots, setHotspots] = useState([])

  useEffect(() => {
    if (hotspotContainer) {
      const childrenArray = React.Children.toArray(children)
      const hotspotsProp = hotspotSpecs || []
      setHotspots([
        ...hotspotsProp.map(createHotspot),
        ...childrenArray.filter(child => child.type.name === 'Hotspot').map(
          hotspot => createHotspot(hotspot)
        )
      ])
    }
  }, [hotspotContainer, hotspotSpecs, children])

  // use a second effect for cleanup to prevent the warning for missing dependencies
  useEffect(() => {
    return () => {
      for (const hotspot of hotspots) {
        hotspotContainer.destroyHotspot(hotspot)
      }
      setHotspots(null)
    }
  }, [hotspotContainer, hotspots])

  return hotspots
}

export default useCreateHotspots
