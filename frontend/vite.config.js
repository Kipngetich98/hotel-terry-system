import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: true,
    strictPort: true,
    allowedHosts: [
      'ssh-key-generator-tunnel-umv6mse9.devinapps.com',
      'b9e5-41-80-114-9.ngrok-free.app',
      'wise-shoes-beam.loca.lt',
      'ssh-key-generator-tunnel-b5j6w7bo.devinapps.com',
      'ssh-key-generatorapp-tunnel-6li7vzrb.devinapps.com'
    ],
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    port: 8080,
    host: true,
    allowedHosts: [
      'ssh-key-generator-tunnel-umv6mse9.devinapps.com',
      'b9e5-41-80-114-9.ngrok-free.app',
      'wise-shoes-beam.loca.lt',
      'ssh-key-generator-tunnel-b5j6w7bo.devinapps.com',
      'ssh-key-generatorapp-tunnel-6li7vzrb.devinapps.com'
    ],
  }
});
