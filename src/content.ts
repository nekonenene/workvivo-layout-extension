let enabled = true
let scheduled = 0

// 初期値をロード
chrome.storage.sync.get({ enabled: true }, (res) => {
  enabled = !!res.enabled
  scheduleApply()
})

// storage変更監視（popupからの切替時）
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) {
    enabled = !!changes.enabled.newValue
    scheduleApply()
  }
})

const isSpacesFeed = (url: string) =>
  /\/spaces\/[^/]+\/feed\/?$/.test(new URL(url).pathname)

const applyForRootLike = () => {
  const leftSidebar = document.querySelector<HTMLElement>('#leftSidebar')
  if (leftSidebar && leftSidebar.style.display !== 'none') {
    leftSidebar.style.display = 'none'
  }
  const mainFeed = document.querySelector<HTMLElement>(
    '[role="region"][aria-label="メインフィード"]'
  )
  if (mainFeed && mainFeed.classList.contains('col-xl-6')) {
    mainFeed.classList.replace('col-xl-6', 'col-xl-9')
  }
}

const applyForSpacesFeed = () => {
  const main = document.querySelector<HTMLElement>('main#mainContent')
  if (main && main.classList.contains('col-xl-6')) {
    main.classList.replace('col-xl-6', 'col-xl-9')
  }
}

const runOnce = () => {
  if (!enabled) return
  if (isSpacesFeed(location.href)) applyForSpacesFeed()
  else applyForRootLike()
}

const scheduleApply = () => {
  if (scheduled) return
  scheduled = window.setTimeout(() => {
    try {
      runOnce()
    } finally {
      scheduled = 0
    }
  }, 50)
}

// 初回実行
scheduleApply()

// DOM変更監視
const mo = new MutationObserver(() => scheduleApply())
mo.observe(document.documentElement, { childList: true, subtree: true })

// URL変化（SPA対応）
const origPush = history.pushState
history.pushState = function (...args) {
  const ret = origPush.apply(this, args as any)
  scheduleApply()
  return ret
}
window.addEventListener('popstate', scheduleApply)
