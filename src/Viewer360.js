import React, { useRef } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import styled from 'styled-components'

import rootReducer from 'store'
import useViewer from 'useViewer'
import { useCreateSceneSpecs, useSceneLoader } from 'scenes'
import { useCreateHotspots } from 'hotspots'


const store = createStore(rootReducer)

const ViewerCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export default function Viewer360(props) {
  const viewerCanvas = useRef(null)
  const viewer = useViewer(viewerCanvas)

  const currentSceneId = props.currentScene
  const sceneSpecs = useCreateSceneSpecs(props)
  const loadedScenes = useSceneLoader(viewer, sceneSpecs, currentSceneId)
  const currentScene = currentSceneId && loadedScenes ? loadedScenes[currentSceneId] : null
  const hotspotContainer = currentScene && currentScene.hotspotContainer ? currentScene.hotspotContainer() : null

  const hotspotsToCreate = useCreateHotspots(viewer, hotspotContainer, props)

  return (
    <Provider store={store}>
      <ViewerCanvas ref={viewerCanvas} />
      <div>
        {hotspotsToCreate}
      </div>
    </Provider>
  )
}
