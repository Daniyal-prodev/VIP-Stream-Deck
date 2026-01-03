import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    root: 'vip-streamdeck/ui',
    plugins: [react()],
    server: {
        port: 5173,
    },
    build: {
        outDir: '../../dist',
        emptyOutDir: true
    }
})
