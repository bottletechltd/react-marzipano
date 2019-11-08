import PropTypes from 'prop-types'

/**
 * User-facing component for creating a scene
 *
 * It doesn't render anything because it is just used to carry props,
 * which useCreateSceneSpec and useSceneLoader then use to load the
 * actual scenes into Marzipano.
 */
function Scene (props) {
  return null
}

Scene.propTypes = {
  current: PropTypes.bool,
  imageUrl: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]).isRequired,
  type: PropTypes.string.isRequired,
  layers: PropTypes.array,
  onLoad: PropTypes.func
}

export default Scene
