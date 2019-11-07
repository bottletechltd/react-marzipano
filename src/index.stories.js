import React from 'react'

import Viewer360 from 'Viewer360'
import Scene from 'Scene'
import Hotspot from 'Hotspot'


export default {
  title: 'Viewer360'
}

export const blankViewer = () => <Viewer360 />

export const oneSceneComponent = () => (
  <Viewer360 currentScene='0'>
    <Scene id='0' filepath='//www.marzipano.net/media/equirect/angra.jpg' type='equirect'/>
  </Viewer360>
)
