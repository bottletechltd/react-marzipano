import uniqid from 'uniqid'

class SceneSpec {
  constructor({ imageUrl, type, layers, onLoad, current }) {
    this.id = uniqid()
    this.imageUrl = imageUrl
    this.type = type
    this.layers = layers
    this.onLoad = onLoad
    this.current = current
  }
}

export default SceneSpec
