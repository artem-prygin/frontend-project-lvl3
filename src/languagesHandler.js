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
  nodes.feedbackField.textContent = state.feedbackMsg
    ? i18n.t(`feedbackMsg.${state.feedbackMsg}`)
    : '';
  const channelsTitle = document.getElementById('channelsTitle');
  if (channelsTitle) {
    channelsTitle.textContent = i18n.t('rss.channelsTitle');
  }
  const feedTitle = document.getElementById('feedTitle');
  if (feedTitle) {
    feedTitle.textContent = i18n.t('rss.feedTitle');
  }
  const openModalBtns = document.querySelectorAll('.modal-open');
  if (openModalBtns.length > 0) {
    openModalBtns.forEach((btn) => {
      const currentBtn = btn;
      currentBtn.textContent = i18n.t('rss.openModalBtn');
    });
  }
};

export const i18nObj = i18n;
