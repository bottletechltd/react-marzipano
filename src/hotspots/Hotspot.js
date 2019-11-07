import PropTypes from 'prop-types'


/**
 * User-facing Hotspot component, for the external API
 *
 * Place inside a <Viewer360> element to create a hotspot inside the viewer
 *
 * (For developers): Only used to carry user parameters for any given hotspot.
 * Will be converted to an internal representation inside useCreateHotspot
 */
function Hotspot(props) {
  return null
}

Hotspot.propTypes = {
  viewer: PropTypes.object,
  transform: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

export default Hotspot
