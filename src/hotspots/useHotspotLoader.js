import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'


function useHotspotLoader(hotspotContainer, transform, rootElement, children) {
  const hotspot = useRef(null)

  useEffect(() => {
    if (hotspotContainer && transform && rootElement.current) {
      const { yaw, pitch, radius } = transform.coords
      const opts = { perspective: { radius } }

      hotspot.current = hotspotContainer.createHotspot(rootElement.current, { yaw, pitch }, opts)

      React.Children.forEach(children, child => {
        ReactDOM.render(child, hotspot.current.domElement())
      })

      hotspot.current.show()
    }

    return () => {
      if (hotspot.current) {
        hotspotContainer.destroyHotspot(hotspot.current)
        hotspot.current = null
      }
    }
  }, [hotspotContainer, transform, rootElement, children])

  return hotspot
}

export default useHotspotLoader
