import React from 'react'
import { addDecorator, configure } from '@storybook/react'


addDecorator(storyFn => <div style={{ margin: 0, width: '100vw', height: '100vh' }}>{storyFn()}</div>)

configure(require.context('../src', true, /\.stories\.js$/), module)
