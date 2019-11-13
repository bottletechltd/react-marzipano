import useViewer from 'useViewer'
import { useCreateSceneSpecs, useSceneLoader } from 'scenes'
import { useCreateHotspots } from 'hotspots'


function useMarzipano(viewerCanvas, spec) {
  // Viewer initialization
  const viewer = useViewer(viewerCanvas)

  // Scene Loading
  const sceneSpecs = useCreateSceneSpecs(spec)
  useSceneLoader(viewer, sceneSpecs)
  const currentScene = null

  // Hotspot Loading
  const hotspotContainer = currentScene && currentScene.hotspotContainer ? currentScene.hotspotContainer() : null
  const hotspots = useCreateHotspots(hotspotContainer, spec.hotspots, [])
}

export default useMarzipano
