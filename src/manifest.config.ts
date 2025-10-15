import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  version: '1.0.2',
  default_locale: 'ja',
  name: '__MSG_extensionName__',
  description: '__MSG_extensionDescription__',
  icons: { '128': 'src/assets/icon128.png' },

  action: {
    default_popup: 'src/popup/index.html',
    default_title: '__MSG_extensionName__',
  },

  permissions: ['storage'],

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
