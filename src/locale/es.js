import constants from '../constants.js';

export default {
  translation: {
    [constants.SITE_DESCRIPTION]: '¡Empiece a leer RSS hoy! Es simple, es hermoso.',
    [constants.EXAMPLE_URL]: 'Ejemplo',
    [constants.SUBMIT_BTN]: 'Añadir',
    [constants.CLOSE_MODAL_BTN]: 'Cerrar',
    [constants.OPEN_ARTICLE]: 'Leer completamente',
    [constants.CREATED_BY]: 'Creado por',
    rss: {
      [constants.CHANNELS_TITLE]: 'Canales',
      [constants.FEED_TITLE]: 'RSS Feed',
      [constants.OPEN_MODAL_BTN]: 'Mirar',
    },
    messages: {
      [constants.RSS_HAS_BEEN_LOADED]: 'RSS se agregó exitosamente',
      [constants.RSS_IS_LOADING]: 'Cargando...',
    },
    errors: {
      [constants.URL]: 'Ingrese una URL válida',
      [constants.FIELD_IS_REQUIRED]: 'Requerido para llenar',
      [constants.URL_IS_ALREADY_IN_THE_LIST]: 'Este feed RSS ya se ha agregado',
      [constants.URL_HAS_NO_RSS]: 'Este recurso no contiene RSS',
      [constants.NETWORK_ERROR]: 'Internet no está disponible',
    },
  },
};
