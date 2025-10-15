import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Workvivo Layout Modifier for Chrome Extensions',
  version: '1.1.0',
  description: 'Workvivoのレイアウトを画面ごとに調整できるChrome拡張（ON/OFFトグル対応）',
  icons: { '128': 'src/assets/icon128.png' },

  action: {
    default_popup: 'src/popup/index.html',
    default_title: 'Workvivo Layout Modifier',
  },

  permissions: ['storage', 'tabs'],
  host_permissions: ['https://*.workvivo.us/*'],

  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },

  content_scripts: [
    {
      matches: ['https://*.workvivo.us/*'],
      js: ['src/content.ts'],
      run_at: 'document_idle',
    },
  ],
});
