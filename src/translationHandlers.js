import i18n from 'i18next';
import resources from './locale/translations.js';
import nodes from './DOMelements.js';

i18n.init({
  lng: 'en',
  debug: false,
  resources,
});

export const translate = (state) => {
  nodes.submitBtn.textContent = i18n.t('submitBtn');
  nodes.siteDescription.textContent = i18n.t('description');
  nodes.exampleUrl.textContent = i18n.t('exampleUrl');
  nodes.openFullArticle.textContent = i18n.t('openFullArticle');
  nodes.closeModalBtn.textContent = i18n.t('closeModalBtn');
  nodes.feedbackField.textContent = state.feedbackMsg
    ? i18n.t(`feedbackMsg.${state.feedbackMsg}`)
    : '';
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

export const i18nObj = i18n;
