import React, { useRef } from 'react'
import styled from 'styled-components'

import useViewer from 'useViewer'
import { useCreateSceneSpecs, useSceneLoader } from 'scenes'
import { useCreateHotspots } from 'hotspots'


const Root = styled.div`
  width: 100%;
  height: 100%;
`

const ViewerCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export default function Viewer360(props) {
  // Viewer initialization
  const viewerCanvas = useRef(null)
  const viewer = useViewer(viewerCanvas)

  // Scene Loading
  const sceneSpecs = useCreateSceneSpecs(props)
  useSceneLoader(viewer, sceneSpecs)
  const currentScene = null

  // Hotspot Loading
  const hotspotContainer = currentScene && currentScene.hotspotContainer ? currentScene.hotspotContainer() : null
  const hotspotsToCreate = useCreateHotspots(viewer, hotspotContainer, props)

  return (
    <Root>
      <ViewerCanvas ref={viewerCanvas} />
      <div>
        {hotspotsToCreate}
      </div>
    </Root>
  )
}
