import {
  textContent,
  loadingErr,
  loadingMsg,
  formErr,
} from '../constants.js';

export default {
  translation: {
    [textContent.SITE_DESCRIPTION]: 'Начните читать RSS уже сегодня! Это просто, это прекрасно.',
    [textContent.EXAMPLE_URL]: 'Пример',
    [textContent.SUBMIT_BTN]: 'Добавить',
    [textContent.CLOSE_MODAL_BTN]: 'Закрыть',
    [textContent.OPEN_ARTICLE]: 'Читать целиком',
    [textContent.CREATED_BY]: 'Автор:',
    rss: {
      [textContent.CHANNELS_TITLE]: 'Каналы',
      [textContent.FEED_TITLE]: 'RSS Лента',
      [textContent.OPEN_MODAL_BTN]: 'Открыть',
    },
    messages: {
      [loadingMsg.RSS_HAS_BEEN_LOADED]: 'RSS был успешно загружен',
      [loadingMsg.RSS_IS_LOADING]: 'Загрузка...',
    },
    errors: {
      [formErr.URL]: 'Введите валидный url',
      [formErr.FIELD_IS_REQUIRED]: 'Поле обязательно для заполнения',
      [formErr.URL_IS_ALREADY_IN_THE_LIST]: 'Данный RSS-канал уже добавлен',
      [loadingErr.URL_HAS_NO_RSS]: 'Данный ресурс не содержит RSS',
      [loadingErr.NETWORK_ERROR]: 'Сеть недоступна',
    },
  },
};
