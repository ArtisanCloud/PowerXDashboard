import { loadEnv, mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

const loadedEnv = loadEnv('development', process.cwd());
// console.log(loadedEnv);

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      proxy: {
        '/api': {
          target: loadedEnv.VITE_RESOURCE_URL ?? 'http://localhost:8888',
          changeOrigin: true,
        },
        '/resource': {
          target: loadedEnv.VITE_RESOURCE_URL ?? 'http://localhost:8888',
          changeOrigin: true,
        },
        '/bucket': {
          target: loadedEnv.VITE_OSS_URL ?? 'http://localhost:9001',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);
