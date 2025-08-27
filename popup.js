document.addEventListener('DOMContentLoaded', () => {
  const maxWidth = document.getElementById('maxWidth');
  const hideAnimationWave = document.getElementById('hideAnimationWave');
  const cleanMainPage = document.getElementById('cleanMainPage');
  const hideInstallApp = document.getElementById('hideInstallApp');
  const backgroundImage = document.getElementById('backgroundImage');

  // Загружаем сохранённые настройки
  chrome.storage.sync.get(
    [
      'maxWidth',
      'hideAnimationWave',
      'cleanMainPage',
      'hideInstallApp',
      'backgroundImage',
    ],
    (data) => {
      maxWidth.checked = data.maxWidth || false;
      hideAnimationWave.checked = data.hideAnimationWave || false;
      cleanMainPage.checked = data.cleanMainPage || false;
      hideInstallApp.checked = data.hideInstallApp || false;
      hideInstallApp.checked = data.hideInstallApp || false;
      backgroundImage.checked = data.backgroundImage || '';
    }
  );

  // Сохраняем изменения
  [
    maxWidth,
    hideAnimationWave,
    cleanMainPage,
    hideInstallApp,
    backgroundImage,
  ].forEach((el) => {
    el.addEventListener('change', () => {
      const settings = {
        maxWidth: maxWidth.checked,
        hideAnimationWave: hideAnimationWave.checked,
        cleanMainPage: cleanMainPage.checked,
        hideInstallApp: hideInstallApp.checked,
        backgroundImage: backgroundImage.checked,
      };
      chrome.storage.sync.set(settings);
    });
  });
});
