import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv('mode', process.cwd(), ''));
  return defineConfig({
    plugins: [vue()],
    server: {
      open: true,
      host: process.env.VITE_DOMAIN_NAME,
      port: process.env.VITE_PORT_FRONT,
    },
  });
}
