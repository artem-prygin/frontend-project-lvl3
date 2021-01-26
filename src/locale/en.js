import {
  textContent,
  loadingErr,
  loadingMsg,
  formErr,
} from '../constants.js';

export default {
  translation: {
    [textContent.SITE_DESCRIPTION]: 'Start reading RSS today! It is easy, it is nicely.',
    [textContent.EXAMPLE_URL]: 'Example',
    [textContent.SUBMIT_BTN]: 'Add',
    [textContent.CLOSE_MODAL_BTN]: 'Close',
    [textContent.OPEN_ARTICLE]: 'Full Article',
    [textContent.CREATED_BY]: 'Created by',
    rss: {
      [textContent.CHANNELS_TITLE]: 'Channels',
      [textContent.FEED_TITLE]: 'RSS Feed',
      [textContent.OPEN_MODAL_BTN]: 'Preview',
    },
    messages: {
      [loadingMsg.RSS_HAS_BEEN_LOADED]: 'RSS has been loaded',
      [loadingMsg.RSS_IS_LOADING]: 'Loading...',
    },
    errors: {
      [formErr.URL]: 'Must be valid URL',
      [formErr.FIELD_IS_REQUIRED]: 'This field is required',
      [formErr.URL_IS_ALREADY_IN_THE_LIST]: 'Rss already exists',
      [loadingErr.URL_HAS_NO_RSS]: 'This source doesn\'t contain valid rss',
      [loadingErr.NETWORK_ERROR]: 'Network Error',
    },
  },
};
