import '../../main.css'
import ReactDOM from 'react-dom'
import React from 'react'
import Marzipano from '../../src'
import { SceneSpec, HotspotSpec, HotspotElementProps } from '../../src/types'


function Hotspot(props: HotspotElementProps): React.ReactElement {
  return (
    <div style={{ width: '10px', height: '10px', backgroundColor: 'green' }}>
    </div>
  )
}
const scenes = new Map<string, SceneSpec>([
  ["1", {
    isCurrent: true,
    key: "1",
    hotspots: new Map<string, HotspotSpec>([
      ["1", { element: <Hotspot transform={{ coords: { yaw: 0.2, pitch: 0.2, radius: 100 } }} /> }]
    ]),
    imageUrl: 'https://www.marzipano.net/media/equirect/angra.jpg',
    type: 'equirect'
  }],
])
ReactDOM.render(<Marzipano scenes={scenes} />, document.querySelector('#root'))
