import onChange from 'on-change';
import i18n from 'i18next';
import translate from './translation.js';
import {
  handleError,
  handleSuccess,
  handleLoading,
  clearFields,
} from './feedbackHandlers.js';
import render from './render.js';

const watchState = (state) => onChange(state, (path, value) => {
  if (path === 'lng') {
    i18n.changeLanguage(value);
    translate(state);
  }
  if (path === 'lastRssUpdate') {
    render(state);
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
        handleLoading(i18n.t('messages.loadingMsg'));
        break;
      case 'success':
        handleSuccess(state, i18n.t('messages.successMsg'));
        break;
      case 'failure':
        handleError(state, i18n.t(`errors.${state.error}`));
        break;
      default:
        break;
    }
  }
});

export default watchState;
