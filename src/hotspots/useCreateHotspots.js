import React, { useEffect, useState } from 'react'
import uniqid from 'uniqid'

import MarzipanoHotspot from './MarzipanoHotspot'


function useCreateHotspots(viewer, hotspotContainer, props) {
  const [hotspotsToCreate, setHotspotsToCreate] = useState([])

  useEffect(() => {
    if (hotspotContainer) {
      const makeMarzipanoHotspot = (hotspotProps) => {
        // key provided to avoid error from React
        return <MarzipanoHotspot key={uniqid()} hotspotContainer={hotspotContainer} {...hotspotProps} />
      }

      const children = React.Children.toArray(props.children)
      const hotspotsProp = props.hotspots || []
      setHotspotsToCreate([
        ...hotspotsProp.map(makeMarzipanoHotspot),
        ...children.filter(child => child.type.name === 'Hotspot').map(
          hotspot => makeMarzipanoHotspot(hotspot.props)
        )
      ])
    }
  }, [viewer, hotspotContainer, props])

  return hotspotsToCreate
}

export default useCreateHotspots
