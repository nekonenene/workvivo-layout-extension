chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  // 初回インストール時に初期値をセット
  if (reason === 'install') {
    const values = await chrome.storage.sync.get(['enabled']);
    if (values.enabled === undefined) {
      await chrome.storage.sync.set({ enabled: true });
    }
  }
});
