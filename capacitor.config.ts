import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.showcases',
  appName: 'showcases',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
