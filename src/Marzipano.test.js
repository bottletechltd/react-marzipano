import React from 'react'
import { wait } from '@testing-library/react'
import TestRenderer from 'react-test-renderer'
import nock from 'nock'

import Marzipano from './Marzipano'


test('Match snapshot', () => {
  const marzipano = TestRenderer.create(
    (<Marzipano scenes={[{
      current: true,
      imageUrl: 'https://www.marzipano.net/media/equirect/angra.jpg',
      type: 'equirect'
    }]} />)
  )
  const tree = marzipano.toJSON()
  expect(tree).toMatchSnapshot()
})


test('makes network request', async () => {
  const imageUrl = 'https://www.marzipano.net/media/equirect/angra.jpg'
  const scope = nock(imageUrl).get('/').reply(200)

  let done = false
  TestRenderer.create(
    <Marzipano scenes={[{
      current: true,
      imageUrl,
      type: 'equirect'
    }]} onLoad={
      () => {
        done = true
        expect(scope.isDone()).toBe(true)
      }
    }/>)

  await wait(() => done, { timeout: 10000 })
})
