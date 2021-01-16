import constants from '../constants.js';

export default {
  translation: {
    [constants.SITE_DESCRIPTION]: 'Начните читать RSS уже сегодня! Это просто, это прекрасно.',
    [constants.EXAMPLE_URL]: 'Пример',
    [constants.SUBMIT_BTN]: 'Добавить',
    [constants.CLOSE_MODAL_BTN]: 'Закрыть',
    [constants.OPEN_ARTICLE]: 'Читать целиком',
    [constants.CREATED_BY]: 'Автор:',
    rss: {
      [constants.CHANNELS_TITLE]: 'Каналы',
      [constants.FEED_TITLE]: 'RSS Лента',
      [constants.OPEN_MODAL_BTN]: 'Открыть',
    },
    messages: {
      [constants.RSS_HAS_BEEN_LOADED]: 'RSS был успешно загружен',
      [constants.RSS_IS_LOADING]: 'Загрузка...',
    },
    errors: {
      [constants.URL]: 'Введите валидный url',
      [constants.FIELD_IS_REQUIRED]: 'Поле обязательно для заполнения',
      [constants.URL_IS_ALREADY_IN_THE_LIST]: 'Данный RSS-канал уже добавлен',
      [constants.URL_HAS_NO_RSS]: 'Данный ресурс не содержит RSS',
      [constants.NETWORK_ERROR]: 'Сеть недоступна',
    },
  },
};
