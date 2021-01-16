import i18n from 'i18next';
import constants from './constants.js';

const printFeedback = (nodes, state) => {
  switch (state.formState) {
    case constants.FAILURE:
      nodes.feedbackField.textContent = i18n.t(`errors.${state.errors.rssSearch}`);
      break;
    case constants.SUCCESS:
      nodes.feedbackField.textContent = i18n.t(`messages.${constants.RSS_HAS_BEEN_LOADED}`);
      break;
    case constants.SUBMITTED:
      nodes.feedbackField.textContent = i18n.t(`messages.${constants.RSS_IS_LOADING}`);
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
  nodes.submitBtn.textContent = i18n.t(constants.SUBMIT_BTN);
  nodes.siteDescription.textContent = i18n.t(constants.SITE_DESCRIPTION);
  nodes.exampleUrl.textContent = i18n.t(constants.EXAMPLE_URL);
  nodes.openFullArticle.textContent = i18n.t(constants.OPEN_ARTICLE);
  nodes.closeModalBtn.textContent = i18n.t(constants.CLOSE_MODAL_BTN);
  nodes.createdBy.textContent = i18n.t(constants.CREATED_BY);
  setFlagsStyles(nodes, state);
  printFeedback(nodes, state);
  if (state.rssItems.length > 0) {
    const channelsTitle = document.getElementById('channelsTitle');
    channelsTitle.textContent = i18n.t(`rss.${constants.CHANNELS_TITLE}`);
    const feedTitle = document.getElementById('feedTitle');
    feedTitle.textContent = i18n.t(`rss.${constants.FEED_TITLE}`);
    const openModalBtns = document.querySelectorAll('.modal-open');
    openModalBtns.forEach((btn) => {
      btn.textContent = i18n.t(`rss.${constants.OPEN_MODAL_BTN}`);
    });
  }
};
