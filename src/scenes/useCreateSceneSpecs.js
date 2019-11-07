import React, { useEffect, useState } from 'react'


function useCreateSceneSpecs(props) {
  const [scenesToCreate, setScenesToCreate] = useState({})
  useEffect(() => {
    const children = React.Children.toArray(props.children)
    const scenesProp = props.scenes
    setScenesToCreate({
      ...(scenesProp || {}),
      ...(Object.fromEntries(
        children.filter(child => child.type.name === 'Scene').map(
          scene => {
            const { id, ...otherProps } = scene.props
            return [id, { ...otherProps }]
          }
        )
      ))
    })
  }, [props])

  return scenesToCreate
}

export default useCreateSceneSpecs
