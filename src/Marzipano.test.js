import React from 'react'
import renderer from 'react-test-renderer'

import Marzipano from './Marzipano'


test('Match snapshot', () => {
  const marzipano = renderer.create(
    (<Marzipano scenes={[{
      current: true,
      imageUrl: 'https://www.marzipano.net/media/equirect/angra.jpg',
      type: 'equirect'
    }]} />)
  )
  const tree = marzipano.toJSON()
  expect(tree).toMatchSnapshot()
})
