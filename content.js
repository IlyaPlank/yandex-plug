function applySettings(settings) {
  // Задать максимальную ширину для body
  const body = document.querySelector('body');
  if (body) body.style.maxWidth = settings.maxWidth ? '1920px' : '';

  // Скрыть анимацию волны
  const canvas = document.querySelector('[class^="VibeAnimation_root"] canvas');
  if (canvas) {
    canvas.style.display = settings.hideAnimationWave ? 'none' : '';
  }

  // Сдвинуть элементы предложки вниз
  const vibeBlock = document.querySelector('[class^="VibeBlock_root"]');
  if (vibeBlock) {
    vibeBlock.style.minHeight = settings.cleanMainPage
      ? 'calc(100vh - 135px)'
      : '';
  }

  const navbarDesktopAnimatedBar = document.querySelector(
    '[class^="NavbarDesktopAnimatedBar_root"]'
  );

  if (navbarDesktopAnimatedBar) {
    navbarDesktopAnimatedBar.style.display = settings.hideInstallApp
      ? 'none'
      : '';
  }
}

function initSettingsObserver() {
  // Загружаем настройки
  chrome.storage.sync.get(
    ['maxWidth', 'hideAnimationWave', 'cleanMainPage', 'hideInstallApp'],
    (settings) => {
      applySettings(settings);

      // Создаем наблюдатель за изменениями DOM
      const observer = new MutationObserver(() => applySettings(settings));
      observer.observe(document.body, { childList: true, subtree: true });
    }
  );

  // Следим за изменениями настроек
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      chrome.storage.sync.get(
        ['maxWidth', 'hideAnimationWave', 'cleanMainPage', 'hideInstallApp'],
        applySettings
      );
    }
  });
}

// Дожидаемся полной загрузки страницы
window.addEventListener('load', () => {
  initSettingsObserver();
});

// Управление музыкой пробелом
document.addEventListener('keydown', function (e) {
  const active = document.activeElement;
  if (
    active &&
    (active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable)
  ) {
    return;
  }

  if (e.code === 'Space') {
    e.preventDefault();

    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }

    const btn = document.querySelector(
      '[aria-labelledby="player-region"] [aria-label="Предыдущая песня"] + [aria-label="Воспроизведение"], [aria-labelledby="player-region"] [aria-label="Предыдущая песня"] + [aria-label="Пауза"]'
    );

    if (btn) btn.click();
  }
});
