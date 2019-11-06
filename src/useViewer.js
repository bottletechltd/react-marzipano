import { useEffect } from 'react'
import Marzipano from 'marzipano'


let _viewer = null

export function viewer() {
  return _viewer
}

export function hotspotContainer() {
  return (_viewer && _viewer.scene()) ? _viewer.scene().hotspotContainer() : null
}

function resetViewer() {
  if (_viewer !== null) {
    _viewer.destroy()
    _viewer = null
  }
}

const viewerOpts = {
  controls: {
    mouseViewMode: 'drag'    // drag|qtvr
  }
}

function useViewer(container) {
  useEffect(() => {
    if (container === null) {
      throw TypeError('Container cannot be null, or viewer will not be initialized')
    }
    if (container && container.current && _viewer === null) {
      _viewer = new Marzipano.Viewer(container.current, viewerOpts)
    }

    return () => {
      _viewer.destroy()
      _viewer = null
    }
  }, [container])

  return _viewer
}



export default useViewer
