import React, { useEffect, useRef, useState } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import styled from 'styled-components'

import rootReducer from 'store'
import useViewer from 'useViewer'
import useSceneLoader from 'useSceneLoader'
import useHotspotLoader from 'useHotspotLoader'


const store = createStore(rootReducer)

const ViewerCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export default function Viewer360(props) {
  const viewerCanvas = useRef(null)
  const viewer = useViewer(viewerCanvas)

  const currentScene = props.currentScene
  const scenesProp = props.scenes
  const hotspotsProp = props.hotspots || []

  const [scenesToCreate, setScenesToCreate] = useState({})
  useEffect(() => {
    const children = React.Children.toArray(props.children)
    setScenesToCreate({
      ...(scenesProp || {}),
      ...(Object.fromEntries(
        children.filter(child => child.type.name === 'Scene').map(
          scene => {
            const { id, ...otherProps } = scene.props
            return [id, { ...otherProps }]
          }
        )
      ))
    })
  }, [scenesProp])
  useSceneLoader(viewer, scenesToCreate, currentScene)

  const hotspotsToCreate = [
    ...hotspotsProp.map(props => <Hotspot viewer={viewer} {...props} />),
    //...children.filter(child => child.type.name === 'Hotspot').map(
    //  hotspot => React.cloneElement(hotspot, { viewer } )
    //)
  ]

  return (
    <Provider store={store}>
      <ViewerCanvas ref={viewerCanvas} />
      <div>
        {hotspotsToCreate}
      </div>
    </Provider>
  )
}
