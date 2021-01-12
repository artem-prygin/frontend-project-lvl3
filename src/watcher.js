import _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import { i18nObj as i18n, translate } from './languagesHandler.js';
import { handleError, handleSuccess, clearFields } from './feedbackHandler.js';
import render from './render.js';
import nodes from './DOMelements.js';

yup.setLocale({
  mixed: {
    required: i18n.t('feedbackMsg.required'),
  },
  string: {
    url: i18n.t('feedbackMsg.url'),
  },
});

const schema = yup.object().shape({
  url: yup.string().url().required(),
});

export const validateForm = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

const state = {
  urls: [],
  channels: [],
  items: [],
  currentChannelID: null,
  formState: '',
  lng: i18n.language,
  feedbackMsg: null,
};

export const addRSS = (url, data) => {
  state.urls.push(url);
  const channelID = state.channels.length ? state.channels.length + 1 : 1;
  state.channels.push({ title: data.channelTitle, id: channelID });
  state.currentChannelID = channelID;
  const itemsWithID = data.itemsData.map((item, index) => ({ ...item, id: index + 1, channelID }));
  state.items = [...state.items, ...itemsWithID];
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
        nodes.rssWrapper.innerHTML = '<img src="../assets/loading.gif" alt="loading">';
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
