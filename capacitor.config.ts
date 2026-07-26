import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asvior.app',
  appName: 'Asvior',
  webDir: 'dist/client',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;