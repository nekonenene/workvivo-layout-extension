const checkbox = document.getElementById('toggle') as HTMLInputElement;

// 現在の状態を反映
chrome.storage.sync.get({ enabled: true }, (res: { enabled?: boolean }) => {
  checkbox.checked = !!res.enabled;
});

// i18n対応。"data-i18n" 属性が設定されている場合に、対応するメッセージを表示
const i18nElements = document.querySelectorAll('[data-i18n]');
i18nElements.forEach((el) => {
  const key = el.getAttribute('data-i18n');
  const msg = chrome.i18n.getMessage(key!);
  if (msg !== undefined && msg !== '') {
    el.textContent = msg;
  }
});

// チェックボックスの変更を監視
checkbox.addEventListener('change', async () => {
  const enabled = checkbox.checked;
  await chrome.storage.sync.set({ enabled });

  // 現在のタブをリロードして状態を反映
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    await chrome.tabs.reload(tab.id, { bypassCache: false });
  }
});
