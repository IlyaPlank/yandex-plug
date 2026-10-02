chrome.runtime.onInstalled.addListener(() => {
  // По умолчанию выключаем иконку
  chrome.action.disable();

  // Удаляем старые правила
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    const rule = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostEquals: 'music.yandex.ru',
            schemes: ['https'],
          },
        }),
      ],

      actions: [new chrome.declarativeContent.ShowAction()],
    };

    // Включаем action только на Yandex Music
    chrome.declarativeContent.onPageChanged.addRules([rule]);
  });
});
