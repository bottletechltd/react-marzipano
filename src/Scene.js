import PropTypes from 'prop-types'

function Scene (props) {
  return null
}

Scene.propTypes = {
  id: PropTypes.string,
  imageUrl: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]).isRequired,
  type: PropTypes.string.isRequired,
  layers: PropTypes.array,
  onLoad: PropTypes.func
}

export default Scene
