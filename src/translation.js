import i18n from 'i18next';
import nodes from './DOMelements.js';

const printFeedback = (state) => {
  switch (state.formState) {
    case 'failure':
      nodes.feedbackField.textContent = i18n.t(`errors.${state.error}`);
      break;
    case 'success':
      nodes.feedbackField.textContent = i18n.t('messages.successMsg');
      break;
    case 'submitted':
      nodes.feedbackField.textContent = i18n.t('messages.loadingMsg');
      break;
    default:
      nodes.feedbackField.textContent = '';
  }
};

export default (state) => {
  nodes.submitBtn.textContent = i18n.t('submitBtn');
  nodes.siteDescription.textContent = i18n.t('description');
  nodes.exampleUrl.textContent = i18n.t('exampleUrl');
  nodes.openFullArticle.textContent = i18n.t('openFullArticle');
  nodes.closeModalBtn.textContent = i18n.t('closeModalBtn');
  nodes.createdBy.textContent = i18n.t('createdBy');
  printFeedback(state);
  if (state.items.length > 0) {
    const channelsTitle = document.getElementById('channelsTitle');
    channelsTitle.textContent = i18n.t('rss.channelsTitle');
    const feedTitle = document.getElementById('feedTitle');
    feedTitle.textContent = i18n.t('rss.feedTitle');
    const openModalBtns = document.querySelectorAll('.modal-open');
    openModalBtns.forEach((btn) => {
      const currentBtn = btn;
      currentBtn.textContent = i18n.t('rss.openModalBtn');
    });
  }
};
