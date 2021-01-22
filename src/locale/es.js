import constants from '../constants.js';

export default {
  translation: {
    [constants.textContent.SITE_DESCRIPTION]: '¡Empiece a leer RSS hoy! Es simple, es hermoso.',
    [constants.textContent.EXAMPLE_URL]: 'Ejemplo',
    [constants.textContent.SUBMIT_BTN]: 'Añadir',
    [constants.textContent.CLOSE_MODAL_BTN]: 'Cerrar',
    [constants.textContent.OPEN_ARTICLE]: 'Leer completamente',
    [constants.textContent.CREATED_BY]: 'Creado por',
    rss: {
      [constants.textContent.CHANNELS_TITLE]: 'Canales',
      [constants.textContent.FEED_TITLE]: 'RSS Feed',
      [constants.textContent.OPEN_MODAL_BTN]: 'Mirar',
    },
    messages: {
      [constants.loadingMsg.RSS_HAS_BEEN_LOADED]: 'RSS se agregó exitosamente',
      [constants.loadingMsg.RSS_IS_LOADING]: 'Cargando...',
    },
    errors: {
      [constants.formErrors.URL]: 'Ingrese una URL válida',
      [constants.formErrors.FIELD_IS_REQUIRED]: 'Requerido para llenar',
      [constants.formErrors.URL_IS_ALREADY_IN_THE_LIST]: 'Este feed RSS ya se ha agregado',
      [constants.loadingErr.URL_HAS_NO_RSS]: 'Este recurso no contiene RSS',
      [constants.loadingErr.NETWORK_ERROR]: 'Internet no está disponible',
    },
  },
};
