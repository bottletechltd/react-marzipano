import React from 'react'

import Viewer360 from '../Viewer360'
import { Scene } from '../scenes'
import Hotspot from './Hotspot'


export default {
  title: 'Hotspots'
}

const defaultCoords = { yaw: 0, pitch: 0, radius: 1000 }
const defaultRotation = { x: 0, y: 0, z: 0 }
const defaultTransform = { coords: defaultCoords, rotation: defaultRotation }

export const oneHotspotComponent = () => (
  <Viewer360 currentScene='0'>
    <Scene id='0' imageUrl='//www.marzipano.net/media/equirect/angra.jpg' type='equirect'/>
    <Hotspot id="dicns" transform={defaultTransform}>
      <div style={{ background: 'red', width: 40, height: 40 }}>
        <p>Hotspot</p>
      </div>
    </Hotspot>
  </Viewer360>
)
