import constants from '../constants.js';

export default {
  translation: {
    [constants.SITE_DESCRIPTION]: 'Start reading RSS today! It is easy, it is nicely.',
    [constants.EXAMPLE_URL]: 'Example',
    [constants.SUBMIT_BTN]: 'Add',
    [constants.CLOSE_MODAL_BTN]: 'Close',
    [constants.OPEN_ARTICLE]: 'Full Article',
    [constants.CREATED_BY]: 'Created by',
    rss: {
      [constants.CHANNELS_TITLE]: 'Channels',
      [constants.FEED_TITLE]: 'RSS Feed',
      [constants.OPEN_MODAL_BTN]: 'Preview',
    },
    messages: {
      [constants.RSS_HAS_BEEN_LOADED]: 'RSS has been loaded',
      [constants.RSS_IS_LOADING]: 'Loading...',
    },
    errors: {
      [constants.URL]: 'Must be valid URL',
      [constants.FIELD_IS_REQUIRED]: 'This field is required',
      [constants.URL_IS_ALREADY_IN_THE_LIST]: 'Rss already exists',
      [constants.URL_HAS_NO_RSS]: 'This source doesn\'t contain valid rss',
      [constants.NETWORK_ERROR]: 'Network Error',
    },
  },
};
