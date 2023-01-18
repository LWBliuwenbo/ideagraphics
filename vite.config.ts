import { defineConfig } from 'vite'
import path  from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    lib:{
      entry: path.resolve(__dirname, 'src/engine/index.ts'),
      name: 'IdeaGraphics',
      // the proper extensions will be added
      fileName: 'ideagraphics',
    }
  },

  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src')
    }
  }
})
