import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yusa.depo',
  appName: 'depo-yonetim',
  webDir: 'public',
  bundledWebRuntime: false,
  server: {
    url: 'https://depo-yonetim-projeniz.vercel.app',
    cleartext: true
  }
};

export default config;