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

const watchState = (nodes, state) => onChange(state, (path, value) => {
  if (path === 'lng') {
    i18n.changeLanguage(value);
    translate(nodes, state);
  }
  if (path === 'lastRssUpdate') {
    render(nodes, state);
  }
  if (path === 'formState') {
    switch (value) {
      case 'initializing':
        translate(nodes, state);
        break;
      case 'filling':
        clearFields(nodes, state);
        break;
      case 'submitted':
        handleLoading(nodes, i18n.t('messages.loadingMsg'));
        break;
      case 'success':
        handleSuccess(nodes, state, i18n.t('messages.successMsg'));
        break;
      case 'failure':
        handleError(nodes, state, i18n.t(`errors.${state.error}`));
        break;
      default:
        break;
    }
  }
});

export default watchState;
