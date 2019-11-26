# react-marzipano

WARNING: This library is in early-alpha. Things may not work as expected, APIs may change with each new release. You have been warned.

An (in-progress) library for wrapping Marzipano (https://www.marzipano.net/) for usage within React.

Generally speaking, parameters for the API are the same as those for similar functions within the Marzipano API.


## Contributing

Feel free to submit issues for bug reports or pull requests if you want to directly contribute!

Make sure your code passes the existing eslint checks and the stories within storybook look correct before submitting pull requests, however!


## Example usage of One Scene (API in-progress, may be changed in the future)

Scenes can be preloaded into Marzipano in this way. Notice that `scenes` is an array. This allows for the preloading of several scenes.

The component automatically switches to (displays) the scene which has `current` set to true.

```
export const SceneProp = () => {
  const scenes = [
    { current: true, imageUrl: 'https://www.marzipano.net/media/equirect/angra.jpg', type: 'equirect' }
  ]
  return <Marzipano scenes={scenes} />
}
```

## Example of multiple scenes

The type of the scene can be `'equirect'` or `'cubemap'`. If cubemap, multiresolution images can be used.

`imageUrl` can be set to either a string, in which case it is loaded via `ImageUrlSource.fromString` or a function (which receives the tile parameter).

```
const loadPrague = (tile) => {
  const prefix = 'https://www.marzipano.net/media/prague'
  if (tile.z === 0) {
    const mapY = 'lfrbud'.indexOf(tile.face) / 6
    return { url: `${prefix}/preview.jpg`, rect: { x: 0, y: mapY, width: 1, height: 1 / 6 } }
  }
  return {
    url: `${prefix}/l${tile.z}/${tile.face}/${tile.y + 1}/${tile.x + 1}.jpg`
  }
}

export const MultipleSceneProps = () => {
  const [currentId, setId] = useState(0)

  const scenes = [
    {
      current: currentId === 0,
      imageUrl: 'https://www.marzipano.net/media/equirect/angra.jpg',
      type: 'equirect'
    },
    {
      current: currentId === 1,
      imageUrl: 'https://www.marzipano.net/media/cubemap/{f}.jpg',
      type: 'cubemap',
      levels: [{ tileSize: 1024, size: 1024 }]
    },
    {
      current: currentId === 2,
      imageUrl: loadPrague,
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
  ]
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SceneSwitcher sceneIds={[0, 1, 2]} onSwitchId={id => setId(id)} />
      <Marzipano scenes={scenes} />
    </div>
  )
}
```

## Example of hotspots

Hotspots are an array of react elements, each of which needs a `transform` prop to set its position and rotation in the world.

The transform is an object with format `{ coords: { yaw, pitch, radius }, rotation: { x, y, z } }`.

```
const defaultCoords = { yaw: 0, pitch: 0, radius: 1000 }
const defaultRotation = { x: 0, y: 0, z: 0 }
const defaultTransform = { coords: defaultCoords, rotation: defaultRotation }

const defaultStyle = { background: 'red', width: 40, height: 40 }

const clickable = (onClick, text, style, transform) => <div onClick={onClick} style={style} transform={transform}>{text}</div>

const defaultScene = { current: true, imageUrl: 'https://www.marzipano.net/media/equirect/angra.jpg', type: 'equirect' }

export const MultipleHotspots = () => {
  const [active, setActive] = useState(0)
  const activeStyle = { background: 'blue' }
  const getStyle = index => index === active ? { ...defaultStyle, ...activeStyle } : defaultStyle

  return (
    <Marzipano scenes={[defaultScene]} hotspots={[
      clickable(() => setActive(0), 'Nothing', getStyle(0), defaultTransform),
      clickable(() => setActive(1), 'Two', getStyle(1), { rotation: defaultRotation, coords: { yaw: -0.1, pitch: 0, radius: 1000 } }),
      clickable(() => setActive(2), 'Three', getStyle(2), { rotation: defaultRotation, coords: { yaw: 0, pitch: 0.1, radius: 1000 } })
    ]} />
  )
}
```


## API Documentation (In-Progress; subject to change)

### `Marzipano`

The `Marzipano` component is the viewport for Marzipano's viewer. It is set to 100% width and height by default, however its `className` and `style` can be set via props of the same name.

This is also where the scenes and hotspots specifications can be set.

#### Props

| `className` | `style` | `scenes` | `hotspots` |
| ----------- | ------- | -------- | ---------- |
| A custom `className` for the Marzipano container | A custom `style` for the Marzipano container | See `scenes` below | See `hotspots` below. |

### `scenes`

An array containing scenes to be preloaded from their respective sources. Note that as of now, for preloading to work correctly, a `key` needs to be provided for each scene. This is so the algorithm can identify scenes which have already been preloaded and does not do extra work.

A single scene specification within the array is an object, with a number of parameters (which are explained below). It should look something like:

```
const scenes = [
  { current: true, imageUrl: 'https://www.somesource.net/equirect-panorama.png', type: 'equirect' },
  { imageUrl: 'https://www.someothersource.net/{f}.jpg', type: 'cubemap' }
]
```

Make sure that one of the scene specifications has `current` set to `true`! Or nothing will be displayed.

#### Parameters

| Prop name | Type | Explanation | Required |
| --------- | ---- | ----------- | -------- |
| `type` | String | Either `'equirect'` for an equirect mapped panorama picture (doesn't support multiresolution), or `'cubemap'` for a cubemap mapped picture (or set of picture for multiresolution) | Yes |
| `imageUrl` | Function or String | The url for the scene's layers. Should be similar to the way layers are loaded in Marzipano. A string is a string template that is passed to ImageUrlSource.fromString for loading (see https://www.marzipano.net/reference/ImageUrlSource.html ). A function is passed directly to ImageUrlSource's constructor (an example of this function is included below). | Yes |
| `levels` | Array | An array specifying the sizes of each level passed to the Geometry constructors (either CubeGeometry or EquirectGeometry depending on `type`). (See https://www.marzipano.net/reference/EquirectGeometry.html and https://www.marzipano.net/reference/CubeGeometry.html ) for more details). | Yes |
| `current` | Boolean | Whether this scene is the current scene, to be displayed in the viewer. | No |

```
const imageUrl = (tile) => {
  const prefix = 'https://www.marzipano.net/media/prague'
  if (tile.z === 0) {
    const mapY = 'lfrbud'.indexOf(tile.face) / 6
    return { url: `${prefix}/preview.jpg`, rect: { x: 0, y: mapY, width: 1, height: 1 / 6 } }
  }
  return {
    url: `${prefix}/l${tile.z}/${tile.face}/${tile.y + 1}/${tile.x + 1}.jpg`
  }
}
```

### `hotspots`

An array of hotspot elements for the hotspots to instantiate within the current scene. The library manages their construction and destruction automatically. The elements should be React elements, constructed either with JSX or through React.createElement. Note that `transform` is a required prop to position the hotspot within the scene.

Aside from that, no other prop is required, however, note that percentage sizes will not work with the root element as the hotspot is placed inside a zero width and height container.

Example:

```
const transform0 = { coords: { yaw: Math.PI / 4, pitch: 0, radius: 800 }, rotation: { x: Math.PI / 4, y: 0, z: 0 }
const transform1 = { coords: { yaw: Math.PI / 8, pitch: Math.PI / 8, radius: 500 }, rotation: { x: 0, y: 0, y: 0 } }
const transform2 = { ...transform1, coords: { yaw: - Math.PI / 4, pitch: -Math.PI / 8, radius: 1000 } }

const hotspots = [
  (
  <div transform={{ coords: { yaw: 0, pitch: 0, radius: 1000 } }}>
    <p>Test</p>
  </div>
  ),
  <AComponent transform={transform0}/>,
  <AnotherComponent transform={transform2}/>,
  <button transform={transform1}>Click me!</button>
]
```

#### Props
| Prop | Type | Explanation | Required |
| ---- | ---- | ----------- | -------- |
| `transform` | Object | Provides the yaw, pitch, radius, and extraRotations for the hotspot. | Yes |


## License

See the included LICENSE
