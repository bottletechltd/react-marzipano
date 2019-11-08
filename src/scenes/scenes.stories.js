import React, { useState } from 'react'

import Viewer360 from 'Viewer360'
import Scene from './Scene'


function SceneSwitcher(props) {
  const { sceneIds, onSwitchId } = props

  return (
    <div>
      {sceneIds.map(id => <button key={id} onClick={() => onSwitchId(id)}>{id}</button>)}
    </div>
  )
}

export default {
  title: 'Scenes'
}

export const OneSceneComponent = () => (
  <Viewer360 currentScene='0'>
    <Scene id='0' imageUrl='//www.marzipano.net/media/equirect/angra.jpg' type='equirect'/>
  </Viewer360>
)

export const OneCubemapComponent = () => (
  <Viewer360 currentScene='avdxc'>
    <Scene id='avdxc' imageUrl='//www.marzipano.net/media/cubemap/{f}.jpg' type='cubemap'
      levels={[{ tileSize: 1024, size: 1024 }]} />
  </Viewer360>
)

export const MultipleSceneComponents = () => {
  const sceneIds = ['0', 'avdxc', 'billy0']
  const [currentId, setId] = useState(sceneIds[2])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SceneSwitcher sceneIds={sceneIds} onSwitchId={id => setId(id)} />
      <Viewer360 currentScene={currentId}>
        <Scene id={sceneIds[0]} imageUrl='//www.marzipano.net/media/equirect/angra.jpg' type='equirect'/>
        <Scene id={sceneIds[1]} imageUrl='//www.marzipano.net/media/cubemap/{f}.jpg' type='cubemap'
          levels={[{ tileSize: 1024, size: 1024 }]} />
        <Scene id={sceneIds[2]}
          imageUrl={(tile) => {
            const prefix = '//www.marzipano.net/media/prague'
            if (tile.z === 0) {
              const mapY = 'lfrbud'.indexOf(tile.face) / 6
              return { url: `${prefix}/preview.jpg`, rect: { x: 0, y: mapY, width: 1, height: 1/6 } }
            }
            return {
              url: `${prefix}/l${tile.z}/${tile.face}/${tile.y + 1}/${tile.x + 1}.jpg`
            }
          }}
          type='cubemap'
          levels={[
            { tileSize: 256, size: 256, fallbackOnly: true },
            { tileSize: 512, size: 512 },
            { tileSize: 512, size: 1024 },
            { tileSize: 512, size: 2048 },
            { tileSize: 512, size: 4096 },
            { tileSize: 512, size: 8192 },
            { tileSize: 512, size: 16384 },
            { tileSize: 512, size: 32768 },
            { tileSize: 512, size: 65536 }
          ]}/>
      </Viewer360>
    </div>
  )
}

export const sceneProp = () => {
  const scenes = {
    '0': { imageUrl: '//www.marzipano.net/media/equirect/angra.jpg', type: 'equirect' }
  }
  return <Viewer360 currentScene='0' scenes={scenes} />
}

export const multipleSceneProps = () => {
  const sceneIds = ['0', 'avdxc', 'billy0']
  const [currentId, setId] = useState(sceneIds[1])

  const scenes = {
    [sceneIds[0]]: { imageUrl: '//www.marzipano.net/media/equirect/angra.jpg', type: 'equirect' },
    [sceneIds[1]]: {
      imageUrl: '//www.marzipano.net/media/cubemap/{f}.jpg',
      type: 'cubemap',
      levels: [{ tileSize: 1024, size: 1024 }]
    },
    [sceneIds[2]]: {
      imageUrl: (tile) => {
        const prefix = '//www.marzipano.net/media/prague'
        if (tile.z === 0) {
          const mapY = 'lfrbud'.indexOf(tile.face) / 6
          return { url: `${prefix}/preview.jpg`, rect: { x: 0, y: mapY, width: 1, height: 1/6 } }
        }
        return {
          url: `${prefix}/l${tile.z}/${tile.face}/${tile.y + 1}/${tile.x + 1}.jpg`
        }
      },
      type: 'cubemap',
      levels: [
        { tileSize: 256, size: 256, fallbackOnly: true },
        { tileSize: 512, size: 512 },
        { tileSize: 512, size: 1024 },
        { tileSize: 512, size: 2048 },
        { tileSize: 512, size: 4096 },
        { tileSize: 512, size: 8192 },
        { tileSize: 512, size: 16384 },
        { tileSize: 512, size: 32768 },
        { tileSize: 512, size: 65536 }
      ]
    }
  }
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SceneSwitcher sceneIds={sceneIds} onSwitchId={id => setId(id)} />
      <Viewer360 currentScene={currentId} scenes={scenes} />
    </div>
  )
}
