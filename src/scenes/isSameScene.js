import isEqual from 'lodash.isequal'


export default function isSameScene(scene0, scene1) {
  return Object.is(scene0, scene1) ||
    (scene0.imageUrl === scene1.imageUrl &&
     scene0.type === scene1.type &&
     isEqual(scene0.layers, scene1.layers))
}
