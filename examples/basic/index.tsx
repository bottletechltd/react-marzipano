import './main.css'
import ReactDOM from 'react-dom'
import React from 'react'
import Marzipano from '../../src'


const scenes = new Map([
  ["1", {
    isCurrent: true,
    key: "1",
    hotspots: [],
    imageUrl: 'https://www.marzipano.net/media/equirect/angra.jpg',
    type: 'equirect'
  }],
])
ReactDOM.render(<Marzipano scenes={scenes} />, document.querySelector('#root'))
