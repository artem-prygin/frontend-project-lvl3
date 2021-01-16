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
import constants from './constants.js';

const watchState = (nodes, state) => onChange(state, (path, value) => {
  if (path === 'lng') {
    i18n.changeLanguage(value);
    translate(nodes, state);
  }
  if (path === 'rssItems') {
    render(nodes, state);
  }
  if (path === 'formState') {
    switch (value) {
      case constants.INITIALIZING:
        translate(nodes, state);
        break;
      case constants.FILLING:
        clearFields(nodes, state);
        break;
      case constants.SUBMITTED:
        handleLoading(nodes, i18n.t(`messages.${constants.RSS_IS_LOADING}`));
        break;
      case constants.SUCCESS:
        handleSuccess(nodes, state, i18n.t(`messages.${constants.RSS_HAS_BEEN_LOADED}`));
        break;
      case constants.FAILURE:
        handleError(nodes, state, i18n.t(`errors.${state.errors.rssSearch}`));
        break;
      default:
        break;
    }
  }
});

export default watchState;
