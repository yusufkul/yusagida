import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yusa.depo',
  appName: 'depo-yonetim',
  webDir: 'out', // Next.js statik çıktı klasörü
  server: {
    url: 'https://yusagida.vercel.app', // Canlı URL'niz
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;