import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sistema-uvz-frontend/', // 👈 ADICIONE ESSA LINHA (use o nome exato do seu repositório no GitHub)
})