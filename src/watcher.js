import i18n from 'i18next';
import onChange from 'on-change';
import translate from './translation.js';
import {
  handleLoading,
  handleForm,
  handleRSS,
  handlePosts,
  handleModal,
} from './handlers.js';

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
    case 'channels':
    case 'currentChannelID':
      handleRSS(nodes, state);
      break;
    case 'posts':
    case 'viewedPosts':
      handlePosts(nodes, state);
      break;
    case 'openedPostId':
      handleModal(nodes, state);
      break;
    default:
      break;
  }
});

export default watchState;
