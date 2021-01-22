import i18n from 'i18next';
import c from './constants.js';

const printFeedback = (nodes, state) => {
  if (state.form.status === c.status.IDLE || state.form.status === c.status.FILLING) {
    nodes.feedbackField.textContent = '';
    return;
  }
  switch (state.form.error) {
    case c.FAILURE:
      nodes.feedbackField.textContent = i18n.t(`errors.${state.form.error}`);
      break;
    case c.SUCCESS:
      nodes.feedbackField.textContent = i18n.t(`messages.${c.RSS_HAS_BEEN_LOADED}`);
      break;
    case c.SUBMITTED:
      nodes.feedbackField.textContent = i18n.t(`messages.${c.RSS_IS_LOADING}`);
      break;
    default:
      nodes.feedbackField.textContent = '';
  }
};

const setFlagsStyles = (nodes, state) => {
  nodes.languages.forEach((lang) => lang.classList.remove('language-active'));
  const currentLangFlag = document.querySelector(`.language[data-lng=${state.lng}]`);
  currentLangFlag.classList.add('language-active');
};

export default (nodes, state) => {
  nodes.submitBtn.textContent = i18n.t(c.textContent.SUBMIT_BTN);
  nodes.siteDescription.textContent = i18n.t(c.textContent.SITE_DESCRIPTION);
  nodes.exampleUrl.textContent = i18n.t(c.textContent.EXAMPLE_URL);
  nodes.openFullArticle.textContent = i18n.t(c.textContent.OPEN_ARTICLE);
  nodes.closeModalBtn.textContent = i18n.t(c.textContent.CLOSE_MODAL_BTN);
  nodes.createdBy.textContent = i18n.t(c.textContent.CREATED_BY);
  setFlagsStyles(nodes, state);
  printFeedback(nodes, state);
  if (state.rssItems.length > 0) {
    const channelsTitle = document.getElementById('channelsTitle');
    channelsTitle.textContent = i18n.t(`rss.${c.textContent.CHANNELS_TITLE}`);
    const feedTitle = document.getElementById('feedTitle');
    feedTitle.textContent = i18n.t(`rss.${c.textContent.FEED_TITLE}`);
    const openModalBtns = document.querySelectorAll('.modal-open');
    openModalBtns.forEach((btn) => {
      btn.textContent = i18n.t(`rss.${c.textContent.OPEN_MODAL_BTN}`);
    });
  }
};
