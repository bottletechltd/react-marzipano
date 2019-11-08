import React, { useState } from 'react'

import Viewer360 from '../Viewer360'
import { Scene } from '../scenes'
import Hotspot from './Hotspot'


export default {
  title: 'Hotspots'
}

const defaultCoords = { yaw: 0, pitch: 0, radius: 1000 }
const defaultRotation = { x: 0, y: 0, z: 0 }
const defaultTransform = { coords: defaultCoords, rotation: defaultRotation }

const defaultStyle = { background: 'red', width: 40, height: 40 }

const clickable = (onClick, text) => <div onClick={onClick} style={{ ...defaultStyle, background: 'blue' }}>{text}</div>

export const OneHotspotComponent = () => (
  <Viewer360 currentScene='0'>
    <Scene id='0' imageUrl='//www.marzipano.net/media/equirect/angra.jpg' type='equirect'/>
    <Hotspot id="dicns" transform={defaultTransform}>
      <div style={defaultStyle}>
        <p>Hotspot</p>
      </div>
    </Hotspot>
  </Viewer360>
)

export const MultipleHotspotComponents = () => {
  const [showHotspot, setShowHotspot] = useState(true)

  return (
    <Viewer360 currentScene='0'>
      <Scene id='0' imageUrl='//www.marzipano.net/media/equirect/angra.jpg' type='equirect'/>
      <Hotspot id="dicns" transform={defaultTransform}>
        <div style={defaultStyle}>
          <p>Hotspot</p>
        </div>
      </Hotspot>
      { showHotspot &&
        <Hotspot id="akdl" transform={{ coords: { yaw: 0.2, pitch: 0.25, radius: 1000 }, rotation: defaultRotation }}>
          {clickable(() => setShowHotspot(false), 'hide')}
        </Hotspot>
      }
      <Hotspot id="339" transform={{ coords: { yaw: -0.3, pitch: -0.1, radius: 1000 }, rotation: defaultRotation }}>
        {clickable(() => setShowHotspot(true), 'show')}
      </Hotspot>
    </Viewer360>
  )
}
