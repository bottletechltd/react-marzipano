import React, { useEffect, useState } from 'react'
import uniqid from 'uniqid'


function useCreateSceneSpecs(props) {
  const [scenesToCreate, setScenesToCreate] = useState({})
  useEffect(() => {
    const children = React.Children.toArray(props.children)
    const scenesProp = props.scenes
    const mergedScenes = [
      ...(scenesProp || []),
      ...(
        children.filter(child => child.type.name === 'Scene').map(scene => scene.props)
      )
    ]
    console.log(children)
    setScenesToCreate(mergedScenes.map(scene => {
      const id = uniqid()
      return { ...scene, id }
    }))
  }, [props])

  return scenesToCreate
}

export default useCreateSceneSpecs
