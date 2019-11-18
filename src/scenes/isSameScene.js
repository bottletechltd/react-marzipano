import isEqual from 'lodash.isequal'


function isScenePresent(scene0, scene1) {
  return Object.is(scene0, scene1) ||
    (scene0.imageUrl === scene1.imageUrl &&
     scene0.type === scene1.type &&
     isEqual(scene0.layers, scene1.layers))
}

function isSceneSame(scene0, scene1) {
  return Object.is(scene0, scene1) ||
    (scene0.imageUrl === scene1.imageUrl &&
     scene0.type === scene1.type &&
     isEqual(scene0.layers, scene1.layers) &&
     scene0.current === scene1.current)
}

export { isScenePresent, isSceneSame }
