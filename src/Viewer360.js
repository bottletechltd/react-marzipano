import React, { useRef } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import MainView from 'MainView'
import rootReducer from 'store'


const store = createStore(rootReducer)

const useStyles = makeStyles({
  viewerCanvas: {
    position: 'relative',
    width: '100%'
  }
})

export default function Viewer360(props) {
  const classes = useStyles()
  const viewerCanvas = useRef(null)

  const scenesProp = props.scenes
  const hotspotsProp = props.hotspots

  const children = React.Children.toArray(props.children)
  const hotspotsToCreate = {...hotspotsProp,
    ...(Object.fromEntries(
      children.filter(child => child.type.displayName === 'Hotspot').map(
        hotspot => {
          const { id, children, ...otherProps } = hotspot.props
          return [ id, {
            ...otherProps,
            element: React.Children.only(children)
          }]
        }
      )
    ))
  }
  const scenesToCreate = {...scenesProp,
    ...(Object.fromEntries(
      children.filter(child => child.type.displayName === 'Scene').map(
        scene => {
          const { id, ...otherProps } = scene.props
          return [ id, { ...otherProps } ]
        }
      )
    ))
  }

  const viewer = useViewer(viewerCanvas)
  useSceneLoader(viewer, scenesToCreate)
  useHotspotLoader(viewer, hotspotsToCreate)

  return (
    <Provider store={store}>
      <div className={classes.viewerCanvas} ref={viewerCanvas}></div>
    </Provider>
  )
}
