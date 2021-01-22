import i18n from 'i18next';
import onChange from 'on-change';
import translate from './translation.js';
import { handleLoading, handleForm } from './feedbackHandlers.js';
import render from './render.js';

const watchState = (state, nodes) => onChange(state, (path, value) => {
  switch (path) {
    case 'lng':
      i18n.changeLanguage(value)
        .then(() => {
          translate(nodes, state);
        });
      break;
    case 'form.status':
      handleForm(nodes, state);
      break;
    case 'loading.status':
      handleLoading(nodes, state);
      break;
    case 'rssChannels':
    case 'rssItems':
    case 'currentRssChannelID':
    case 'viewedRssItems':
      render(nodes, watchState(state, nodes));
      break;
    default:
      break;
  }
});

export default watchState;
