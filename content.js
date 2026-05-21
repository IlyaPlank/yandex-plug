// Функция для обновления атрибутов в DOM
function updateDomMarkers(settings) {
  const html = document.documentElement;

  for (const [key, value] of Object.entries(settings)) {
    if (key === 'maxWidthValue') {
      // Устанавливаем CSS переменную
      html.style.setProperty('--ext-max-width-val', `${value}px`);
      continue;
    }

    if (value) {
      html.setAttribute(`data-ext-${key}`, '');
    } else {
      html.removeAttribute(`data-ext-${key}`);
    }
  }
}
// function updateDomMarkers(settings) {
//   const html = document.documentElement;
//   for (const [key, value] of Object.entries(settings)) {
//     if (value) {
//       html.setAttribute(`data-ext-${key}`, '');
//     } else {
//       html.removeAttribute(`data-ext-${key}`);
//     }
//   }
//   // Отдельно вызываем функцию для тяжелого динамического контента
//   applyDynamicStyles(settings);
// }

// Только для того, что нельзя решить чистым CSS
function applyDynamicStyles(settings) {
  if (settings.backgroundImage) {
    const coverImg = document.querySelector(
      '[class^="PlayerBarDesktopWithBackgroundProgressBar_infoCard"] img',
    );
    const vibeBlock = document.querySelector('[class^="VibeBlock_root"]');

    if (coverImg && vibeBlock) {
      const imageUrl = coverImg.src || parseSrcset(coverImg.srcset)[0]?.url;
      if (imageUrl) {
        const thumbUrl = imageUrl.replace(/(\/)\d+x\d+$/, '$1400x400');
        vibeBlock.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${thumbUrl}")`;
        vibeBlock.style.backgroundSize = 'cover';
        vibeBlock.style.backgroundPosition = 'center';
      }
    }
  }
}

function parseSrcset(srcset) {
  if (!srcset) return [];
  return srcset.split(',').map((item) => {
    const [url, size] = item.trim().split(/\s+/);
    return { url, size };
  });
}

// Инициализация
chrome.storage.sync.get(null, (settings) => {
  updateDomMarkers(settings);

  // Наблюдаем только за обложкой (динамика), а не за всем телом
  const observer = new MutationObserver(() => applyDynamicStyles(settings));
  observer.observe(document.body, { childList: true, subtree: true });
});

// Слушаем изменения настроек "на лету"
chrome.storage.onChanged.addListener((changes) => {
  chrome.storage.sync.get(null, updateDomMarkers);
});

// Управление пробелом (улучшенный blur)
document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space') return;

  const active = document.activeElement;
  if (
    active &&
    ((active.tagName === 'INPUT' && active.type !== 'range') ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable)
  ) {
    return;
  }

  e.preventDefault();

  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }

  let btn = document.querySelector(
    '[aria-labelledby="player-region"] [aria-label="Предыдущая песня"] + [aria-label="Воспроизведение"], [aria-labelledby="player-region"] [aria-label="Предыдущая песня"] + [aria-label="Пауза"]',
  );

  if (!btn) {
    // Для "Моя волна"
    btn = findMyWavePlayPauseButton();
  }

  if (btn) btn.click();
});

function findMyWavePlayPauseButton() {
  const prevButton = document.querySelector(
    'button[aria-label="Предыдущая песня"]',
  );
  const nextButton = document.querySelector(
    'button[aria-label="Следующая песня"]',
  );

  if (!prevButton || !nextButton) return null;

  // Находим общего родителя
  let container = prevButton.parentElement;
  while (container && !container.contains(nextButton)) {
    container = container.parentElement;
  }

  if (!container) return null;

  // Получаем все кнопки в контейнере в порядке их следования
  const allButtons = [...container.querySelectorAll('button')];

  const prevIndex = allButtons.indexOf(prevButton);
  const nextIndex = allButtons.indexOf(nextButton);

  // Ищем кнопку между ними
  return allButtons.find((btn, index) => {
    return (
      index > prevIndex &&
      index < nextIndex &&
      btn !== prevButton &&
      btn !== nextButton
    );
  });
}
