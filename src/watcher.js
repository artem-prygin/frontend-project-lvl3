import onChange from 'on-change';
import { i18nObj as i18n, translate } from './languagesHandler.js';
import { handleError, handleSuccess, clearFields } from './feedbackHandler.js';
import render from './render.js';
import nodes from './DOMelements.js';
import { loadingGif } from './index.js';

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
        clearFields();
        state.feedbackMsg = null;
        break;
      case 'submitted':
        nodes.submitBtn.setAttribute('disabled', 'disabled');
        nodes.rssWrapper.innerHTML = `<img src="${loadingGif}" alt="loading">`;
        break;
      case 'success':
        handleSuccess(i18n.t(`feedbackMsg.${state.feedbackMsg}`));
        render(state);
        break;
      case 'failure':
        handleError(i18n.t(`feedbackMsg.${state.feedbackMsg}`));
        render(state);
        break;
      default:
        break;
    }
  }
});
