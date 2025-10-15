let enabled = true; // 拡張機能の有効 or 無効設定
let scheduled = 0; // scheduleApply() にて連続発火を防ぐためのタイマーID

// 初期値をロード
chrome.storage.sync.get({ enabled: true }, (res: { enabled?: boolean }) => {
  enabled = res.enabled ?? true; // 未定義の場合も true
  scheduleApply();
});

// storage変更監視（popupからの切替時）
chrome.storage.onChanged.addListener((changes: Record<string, chrome.storage.StorageChange>, areaName: chrome.storage.AreaName) => {
  if (areaName === 'sync' && changes.enabled) {
    enabled = !!changes.enabled.newValue;
    scheduleApply();
  }
});

// トップページに適用
const applyForRootLike = () => {
  const leftSidebar = document.querySelector<HTMLElement>('aside#leftSidebar');
  if (leftSidebar !== null && leftSidebar.classList.contains('col-xl-3')) {
    // d-none クラスのみが残るはず
    leftSidebar.classList.remove('col-xl-3', 'd-xl-block');
  }
  // main#mainContent の親要素の div であり、role="region" を対象にする
  let targetDiv: HTMLElement | null = null;
  const main = document.querySelector<HTMLElement>('main#mainContent');
  if (main !== null) {
    const parentDiv = main.parentElement;
    if (parentDiv !== null && parentDiv.getAttribute('role') === 'region') {
      targetDiv = parentDiv;
    }
  }
  if (targetDiv !== null && targetDiv.classList.contains('col-xl-6')) {
    targetDiv.classList.replace('col-xl-6', 'col-xl-9');
  }
};

// スペースのページに適用
const applyForSpacesFeed = () => {
  const rightSidebar = document.querySelector<HTMLElement>('aside#rightSidebar');
  if (rightSidebar !== null && rightSidebar.classList.contains('col-lg-3')) {
    // d-none クラスのみが残るはず
    rightSidebar.classList.remove('col-lg-3', 'd-lg-block');
  }

  // main#mainContent が複数あるダメなページなので、まず外側の aria-label="view-space" の指定がある mainContent を探す
  const outerMainContent = document.querySelector<HTMLElement>('main#mainContent[aria-label="view-space"]');
  const mainContent = outerMainContent ? outerMainContent.querySelector<HTMLElement>('main#mainContent') : null;
  if (mainContent !== null && mainContent.classList.contains('col-lg-6')) {
    mainContent.classList.replace('col-lg-6', 'col-lg-9');
    mainContent.classList.replace('col-xl-6', 'col-xl-9');
  }
};

// ページの現在URLを判定し、レイアウト変更を一度だけ実行する
const modifyLayout = () => {
  if (!enabled) return;

  const pathname = new URL(location.href).pathname;
  const isSpacesFeed = /\/spaces\/\d+\/feed\/?$/.test(pathname);

  if (isSpacesFeed) {
    applyForSpacesFeed();
  } else {
    applyForRootLike();
  }
};

// style の追加（初回実行時のみ）
const addStyle = () => {
  const style = document.createElement('style');
  style.textContent = `
    .activity-text h1 {
      font-size: 1.6rem;
    }

    .activity-text h2 {
      font-size: 1.3rem;
    }

    .card-body .tw-flex button.btn.btn-link {
      width: 100%;
      height: 26px;
      border: 1px solid #d7d3e3;
      background-color: #fafafa;
    }

    .card-body .tw-flex button.btn.btn-link:hover {
      background-color: #ececec;
    }

    .card-body .tw-flex button.btn.btn-link svg {
      margin: auto;
    }
  `;
  document.head.appendChild(style);
};

// ページ読み込み時やDOM変更時に呼ばれる
// modifyLayout() の連続実行を防ぐため debounce 処理が含まれている
const scheduleApply = () => {
  if (scheduled) return;

  scheduled = window.setTimeout(() => {
    try {
      modifyLayout();
    } finally {
      scheduled = 0;
    }
  }, 50);
};

// 初回実行
addStyle();
scheduleApply();

// DOM変更を監視
const mo = new MutationObserver(() => scheduleApply());
mo.observe(document.documentElement, { childList: true, subtree: true });

// SPA の URL 変化
const origPush = history.pushState.bind(history);
history.pushState = (...args: Parameters<History['pushState']>): void => {
  origPush(...args);
  scheduleApply();
};
window.addEventListener('popstate', () => scheduleApply());
