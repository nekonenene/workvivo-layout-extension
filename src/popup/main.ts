const checkbox = document.getElementById('toggle') as HTMLInputElement

// 現在の状態を反映
chrome.storage.sync.get({ enabled: true }, (res) => {
  checkbox.checked = !!res.enabled
})

checkbox.addEventListener('change', async () => {
  const enabled = checkbox.checked
  await chrome.storage.sync.set({ enabled })

  // 現在のタブをリロードして状態を反映
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id) {
    await chrome.tabs.reload(tab.id, { bypassCache: false })
  }
})
