import React from 'react'
import styled from 'styled-components'
import { addDecorator, configure } from '@storybook/react'


const Root = styled.div`
  margin: 0;
  width: 100vw;
  height: 100vh;
`

addDecorator(storyFn => <Root>{storyFn()}</Root>)

configure(require.context('../src', true, /\.stories\.js$/), module)
