document.addEventListener('DOMContentLoaded', () => {
  // Собираем все нужные элементы один раз
  const elements = {
    maxWidth: document.getElementById('maxWidth'),
    maxWidthValue: document.getElementById('maxWidthValue'),
    widthInputContainer: document.getElementById('widthInputContainer'),
    hideAnimationWave: document.getElementById('hideAnimationWave'),
    cleanMainPage: document.getElementById('cleanMainPage'),
    hideInstallApp: document.getElementById('hideInstallApp'),
    hideAI: document.getElementById('hideAI'),
    backgroundImage: document.getElementById('backgroundImage'),
  };

  // Функция сохранения настроек
  const saveSettings = () => {
    const settings = {};
    // Автоматически собираем значения со всех чекбоксов из объекта elements
    for (const [key, el] of Object.entries(elements)) {
      if (!el) continue;
      if (el.type === 'checkbox') {
        settings[key] = el.checked;
      } else if (el.type === 'number') {
        settings[key] = parseInt(el.value) || 1920;
      }
    }
    chrome.storage.sync.set(settings);
  };

  // Загрузка настроек
  chrome.storage.sync.get(null, (data) => {
    for (const [key, el] of Object.entries(elements)) {
      if (!el) continue;
      if (el.type === 'checkbox') {
        el.checked = !!data[key];
      } else if (el.type === 'number') {
        el.value = data[key] || 1920;
      }
    }
    // Отдельная логика для контейнера ширины
    if (elements.widthInputContainer) {
      elements.widthInputContainer.style.display = data.maxWidth
        ? 'flex'
        : 'none';
    }
  });

  // Навешиваем обработчики событий
  for (const [key, el] of Object.entries(elements)) {
    if (!el) continue;

    const eventType = el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(eventType, () => {
      // Если это главный переключатель ширины — показываем/скрываем поле ввода
      if (key === 'maxWidth' && elements.widthInputContainer) {
        elements.widthInputContainer.style.display = el.checked
          ? 'flex'
          : 'none';
      }
      saveSettings();
    });
  }
});
