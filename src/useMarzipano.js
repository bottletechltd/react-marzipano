import useViewer from 'useViewer'
import { useScenes } from 'scenes'
import { useHotspots } from 'hotspots'


function useMarzipano(viewerCanvas, props) {
  // Viewer initialization
  const viewer = useViewer(viewerCanvas)

  const { scenes: sceneSpecs, hotspots: hotspotSpecs } = props

  // Scene Loading
  const [scenes, currentScene] = useScenes(viewer, sceneSpecs)

  // Hotspot Loading
  const hotspotContainer = currentScene && currentScene.hotspotContainer ? currentScene.hotspotContainer() : null
  const hotspots = useHotspots(hotspotContainer, hotspotSpecs)
}

export default useMarzipano
