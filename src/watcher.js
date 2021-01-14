import onChange from 'on-change';
import { i18nObj as i18n, translate } from './translationHandlers.js';
import {
  handleError,
  handleSuccess,
  clearFields,
  showLoading,
} from './feedbackHandlers.js';

export const state = {
  urls: [],
  channels: [],
  items: [],
  currentChannelID: null,
  formState: '',
  lng: i18n.language,
  feedbackMsg: null,
};

export const watcher = onChange(state, (path, value) => {
  if (path === 'lng') {
    i18n.changeLanguage(value);
    translate(state);
  }
  if (path === 'formState') {
    switch (value) {
      case 'initializing':
        translate(state);
        break;
      case 'filling':
        clearFields(state);
        break;
      case 'submitted':
        showLoading();
        break;
      case 'success':
        handleSuccess(state, i18n.t(`feedbackMsg.${state.feedbackMsg}`));
        break;
      case 'failure':
        handleError(state, i18n.t(`feedbackMsg.${state.feedbackMsg}`));
        break;
      default:
        break;
    }
  }
});
