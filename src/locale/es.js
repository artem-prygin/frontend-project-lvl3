import {
  textContent,
  loadingErr,
  loadingMsg,
  formErr,
} from '../constants.js';

export default {
  translation: {
    [textContent.SITE_DESCRIPTION]: '¡Empiece a leer RSS hoy! Es simple, es hermoso.',
    [textContent.EXAMPLE_URL]: 'Ejemplo',
    [textContent.SUBMIT_BTN]: 'Añadir',
    [textContent.CLOSE_MODAL_BTN]: 'Cerrar',
    [textContent.OPEN_ARTICLE]: 'Leer completamente',
    [textContent.CREATED_BY]: 'Creado por',
    rss: {
      [textContent.CHANNELS_TITLE]: 'Canales',
      [textContent.FEED_TITLE]: 'RSS Feed',
      [textContent.OPEN_MODAL_BTN]: 'Mirar',
    },
    messages: {
      [loadingMsg.RSS_HAS_BEEN_LOADED]: 'RSS se agregó exitosamente',
      [loadingMsg.RSS_IS_LOADING]: 'Cargando...',
    },
    errors: {
      [formErr.INVALID_URL]: 'Ingrese una URL válida',
      [formErr.FIELD_IS_REQUIRED]: 'Requerido para llenar',
      [formErr.URL_IS_ALREADY_IN_THE_LIST]: 'Este feed RSS ya se ha agregado',
      [loadingErr.URL_HAS_NO_RSS]: 'Este recurso no contiene RSS',
      [loadingErr.NETWORK_ERROR]: 'Internet no está disponible',
    },
  },
};
