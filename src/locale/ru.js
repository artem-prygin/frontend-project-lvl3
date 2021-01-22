import constants from '../constants.js';

export default {
  translation: {
    [constants.textContent.SITE_DESCRIPTION]: 'Начните читать RSS уже сегодня! Это просто, это прекрасно.',
    [constants.textContent.EXAMPLE_URL]: 'Пример',
    [constants.textContent.SUBMIT_BTN]: 'Добавить',
    [constants.textContent.CLOSE_MODAL_BTN]: 'Закрыть',
    [constants.textContent.OPEN_ARTICLE]: 'Читать целиком',
    [constants.textContent.CREATED_BY]: 'Автор:',
    rss: {
      [constants.textContent.CHANNELS_TITLE]: 'Каналы',
      [constants.textContent.FEED_TITLE]: 'RSS Лента',
      [constants.textContent.OPEN_MODAL_BTN]: 'Открыть',
    },
    messages: {
      [constants.loadingMsg.RSS_HAS_BEEN_LOADED]: 'RSS был успешно загружен',
      [constants.loadingMsg.RSS_IS_LOADING]: 'Загрузка...',
    },
    errors: {
      [constants.formErrors.URL]: 'Введите валидный url',
      [constants.formErrors.FIELD_IS_REQUIRED]: 'Поле обязательно для заполнения',
      [constants.formErrors.URL_IS_ALREADY_IN_THE_LIST]: 'Данный RSS-канал уже добавлен',
      [constants.loadingErr.URL_HAS_NO_RSS]: 'Данный ресурс не содержит RSS',
      [constants.loadingErr.NETWORK_ERROR]: 'Сеть недоступна',
    },
  },
};
