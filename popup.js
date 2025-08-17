document.addEventListener('DOMContentLoaded', () => {
  const maxWidth = document.getElementById('maxWidth');
  const hideAnimationWave = document.getElementById('hideAnimationWave');

  // Загружаем сохранённые настройки
  chrome.storage.sync.get(['maxWidth', 'hideAnimationWave'], (data) => {
    maxWidth.checked = data.maxWidth || false;
    hideAnimationWave.checked = data.hideAnimationWave || false;
  });

  // Сохраняем изменения
  [maxWidth, hideAnimationWave].forEach((el) => {
    el.addEventListener('change', () => {
      const settings = {
        maxWidth: maxWidth.checked,
        hideAnimationWave: hideAnimationWave.checked,
      };
      chrome.storage.sync.set(settings);
    });
  });
});
