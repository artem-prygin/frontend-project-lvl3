import constants from '../constants.js';

export default {
  translation: {
    [constants.textContent.SITE_DESCRIPTION]: 'Start reading RSS today! It is easy, it is nicely.',
    [constants.textContent.EXAMPLE_URL]: 'Example',
    [constants.textContent.SUBMIT_BTN]: 'Add',
    [constants.textContent.CLOSE_MODAL_BTN]: 'Close',
    [constants.textContent.OPEN_ARTICLE]: 'Full Article',
    [constants.textContent.CREATED_BY]: 'Created by',
    rss: {
      [constants.textContent.CHANNELS_TITLE]: 'Channels',
      [constants.textContent.FEED_TITLE]: 'RSS Feed',
      [constants.textContent.OPEN_MODAL_BTN]: 'Preview',
    },
    messages: {
      [constants.loadingMsg.RSS_HAS_BEEN_LOADED]: 'RSS has been loaded',
      [constants.loadingMsg.RSS_IS_LOADING]: 'Loading...',
    },
    errors: {
      [constants.formErrors.URL]: 'Must be valid URL',
      [constants.formErrors.FIELD_IS_REQUIRED]: 'This field is required',
      [constants.formErrors.URL_IS_ALREADY_IN_THE_LIST]: 'Rss already exists',
      [constants.loadingErr.URL_HAS_NO_RSS]: 'This source doesn\'t contain valid rss',
      [constants.loadingErr.NETWORK_ERROR]: 'Network Error',
    },
  },
};
