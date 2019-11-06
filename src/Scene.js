import PropTypes from 'prop-types'


function Scene(props) {
  return null
}

Scene.propTypes = {
  filepath: PropTypes.string,
  prefix: PropTypes.string,
  layers: PropTypes.array,
  onLoad: PropTypes.func
}

export default Scene
