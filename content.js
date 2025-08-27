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
      ? 'calc(100vh - 120px)'
      : '';
  }

  // Скрыть блок с установкой приложения
  const navbarDesktopAnimatedBar = document.querySelector(
    '[class^="NavbarDesktopAnimatedBar_root"]'
  );
  if (navbarDesktopAnimatedBar) {
    navbarDesktopAnimatedBar.style.display = settings.hideInstallApp
      ? 'none'
      : '';
  }

  // Обложка на фоне
  const coverContainer = document.querySelector(
    '[class^="PlayerBarDesktopWithBackgroundProgressBar_infoCard"] img'
  );
  if (coverContainer) {
    const sources = parseSrcset(coverContainer.srcset);
    const imageUrl = sources[0]?.url;
		console.log('imageUrl', imageUrl) // TODO: Удалить
		console.log('vibeBlock', vibeBlock) // TODO: Удалить
		if (imageUrl && vibeBlock) {
			const newUrl = imageUrl.replace(/\/[^/]+$/, "/400x400");
			console.log('newUrl', newUrl) // TODO: Удалить
			vibeBlock.style.setProperty("--custom-bg", `url("${imageUrl}")`);
		}
  }
}

function parseSrcset(srcset) {
  return srcset.split(',').map((item) => {
    const [url, size] = item.trim().split(/\s+/);
    return { url, size };
  });
}

function initSettingsObserver() {
  // Загружаем настройки
  chrome.storage.sync.get(
    [
      'maxWidth',
      'hideAnimationWave',
      'cleanMainPage',
      'hideInstallApp',
      'backgroundImage',
    ],
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
        [
          'maxWidth',
          'hideAnimationWave',
          'cleanMainPage',
          'hideInstallApp',
          'backgroundImage',
        ],
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
    ((active.tagName === 'INPUT' && active.type !== 'range') ||
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
