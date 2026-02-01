import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import glsl from 'highlight.js/lib/languages/glsl'
import path from 'path'

export default defineConfig({
  base: '/IsaacShaderStudio/',
  plugins: [
    { enforce: 'pre', ...mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeHighlight, {
        languages: { glsl }
      }]]
    }) },
    react(),
    tailwindcss()
  ],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/site/components'),
      '@/hooks': path.resolve(__dirname, './src/site/hooks'),
      '@/stores': path.resolve(__dirname, './src/site/stores'),
      '@/lib': path.resolve(__dirname, './src/site/lib'),
    },
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
})
