function applySettings(settings) {
  // Задать максимальную ширину для body
  const body = document.querySelector('body');
  if (body) body.style.maxWidth = settings.maxWidth ? '1920px' : '';

  // Скрыть анимацию волны

  const timerIntervalAnimationWave = setInterval(() => {
    const canvas = document.querySelector(
      '[class^="VibeAnimation_root"] canvas'
    );

    if (canvas) {
      canvas.style.display = settings.hideAnimationWave ? 'none' : '';
      clearInterval(timerIntervalAnimationWave);
    }
  }, 100);

  setTimeout(() => {
    clearInterval(timerIntervalAnimationWave);
  }, 5000);
}

// Применяем настройки при загрузке
chrome.storage.sync.get(['maxWidth', 'hideAnimationWave'], applySettings);

// Следим за изменением настроек
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    chrome.storage.sync.get(['maxWidth', 'hideAnimationWave'], applySettings);
  }
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
