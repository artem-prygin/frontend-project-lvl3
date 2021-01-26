import i18n from 'i18next';
import { textContent, status, loadingMsg } from './constants.js';

const printFeedback = (nodes, state) => {
  if (state.form.status === status.IDLE) {
    nodes.feedbackField.textContent = '';
    return;
  }
  if (!state.form.isValid) {
    nodes.feedbackField.textContent = i18n.t(`errors.${state.form.error}`);
    return;
  }
  switch (state.loading.status) {
    case status.IN_PROCESS:
      nodes.feedbackField.textContent = i18n.t(`messages.${loadingMsg.RSS_IS_LOADING}`);
      break;
    case status.FAILURE:
      nodes.feedbackField.textContent = i18n.t(`errors.${state.loading.error}`);
      break;
    case status.SUCCESS:
      nodes.feedbackField.textContent = i18n.t(`messages.${loadingMsg.RSS_HAS_BEEN_LOADED}`);
      break;
    default:
      break;
  }
};

const setFlagsStyles = (nodes, state) => {
  nodes.languages.forEach((lang) => lang.classList.remove('language-active'));
  const currentLangFlag = document.querySelector(`.language[data-lng=${state.lng}]`);
  currentLangFlag.classList.add('language-active');
};

export default (nodes, state) => {
  nodes.submitBtn.textContent = i18n.t(textContent.SUBMIT_BTN);
  nodes.siteDescription.textContent = i18n.t(textContent.SITE_DESCRIPTION);
  nodes.exampleUrl.textContent = i18n.t(textContent.EXAMPLE_URL);
  nodes.openFullArticle.textContent = i18n.t(textContent.OPEN_ARTICLE);
  nodes.closeModalBtn.textContent = i18n.t(textContent.CLOSE_MODAL_BTN);
  nodes.createdBy.textContent = i18n.t(textContent.CREATED_BY);
  setFlagsStyles(nodes, state);
  printFeedback(nodes, state);
  if (state.rssItems.length > 0) {
    const channelsTitle = document.getElementById('channelsTitle');
    channelsTitle.textContent = i18n.t(`rss.${textContent.CHANNELS_TITLE}`);
    const feedTitle = document.getElementById('feedTitle');
    feedTitle.textContent = i18n.t(`rss.${textContent.FEED_TITLE}`);
    const openModalBtns = document.querySelectorAll('.modal-open');
    openModalBtns.forEach((btn) => {
      btn.textContent = i18n.t(`rss.${textContent.OPEN_MODAL_BTN}`);
    });
  }
};
