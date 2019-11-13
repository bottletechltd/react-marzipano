import React, { useRef } from 'react'
import styled from 'styled-components'

import useMarzipano from './useMarzipano'


const Root = styled.div`
  width: 100%;
  height: 100%;
`

const ViewerCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export default function Marzipano(props) {
  const viewerCanvas = useRef(null)
  useMarzipano(viewerCanvas, props)

  return (
    <Root>
      <ViewerCanvas ref={viewerCanvas} />
    </Root>
  )
}
