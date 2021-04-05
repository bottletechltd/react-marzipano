import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'react-marzipano',
    },
    rollupOptions: {
      external: [
        'immer',
        'marzipano',
        'react',
        'react-dom',
        'uuid',
      ],
      output: {
        exports: 'named',
        globals: {
          immer: 'Immer',
          marzipano: 'MarzipanoLib',
          react: 'React',
          'react-dom': 'ReactDOM',
          uuid: 'UUID',
        },
      },
    },
  },
})
