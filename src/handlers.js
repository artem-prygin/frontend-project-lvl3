/* eslint no-param-reassign: 0 */
import DOMPurify from 'dompurify';
import i18n from 'i18next';
import {
  textContent,
  loadingMsg,
  formStatus,
  loadingStatus,
} from './constants.js';

const generateChannel = (channel, activeID) => {
  const activeClass = channel.id === activeID ? 'active' : '';
  return `<li class="list-group-item ${activeClass}" data-channel-id="${channel.id}" role="button">
            <h4 data-channel-id="${channel.id}">${channel.title}</h4>
            <small data-channel-id="${channel.id}">${channel.description}</small>
        </li>`;
};

const generatePost = (state, { id, title, link }) => {
  const isViewed = state.viewedPosts.has(id);
  const fontWeightClass = isViewed ? 'font-weight-normal' : 'font-weight-bold';
  const btnClass = isViewed ? 'btn-secondary' : 'btn-primary ';
  const { OPEN_MODAL_BTN } = textContent;
  return `<li class="list-group-item d-flex justify-content-between align-items-start">
    <a href="${link}" class="${fontWeightClass}" target="_blank" rel="noopener noreferrer">${title}</a>
    <button class="btn ${btnClass} modal-open flex-shrink-0" data-post-id="${id}" role="button"
        data-toggle="modal" data-target="#item-modal" data-i18n="rss.${OPEN_MODAL_BTN}">
            ${i18n.t(`rss.${OPEN_MODAL_BTN}`)}
    </button>
  </li>`;
};

const getCurrentPosts = (posts, channelID) => posts
  .filter((post) => post.channelID === channelID);

export const handlePosts = (nodes, state) => {
  const { currentChannelID: channelID, posts } = state;
  const currentPosts = getCurrentPosts(posts, channelID);
  const { FEED_TITLE } = textContent;
  const postsTitle = `<h2 data-i18n="rss.${FEED_TITLE}">${i18n.t(`rss.${FEED_TITLE}`)}</h2>`;
  const postsList = currentPosts.map((post) => generatePost(state, post)).join('');
  nodes.postsWrapper.innerHTML = DOMPurify.sanitize(`${postsTitle}${postsList}`);
};

export const handleChannels = (nodes, state) => {
  const { currentChannelID: activeID, channels } = state;
  if (channels.length === 0) {
    return;
  }
  handlePosts(nodes, state);
  const { CHANNELS_TITLE } = textContent;
  const channelsTitle = `<h2 data-i18n="rss.${CHANNELS_TITLE}">${i18n.t(`rss.${CHANNELS_TITLE}`)}</h2>`;
  const channelsList = channels.map((channel) => generateChannel(channel, activeID)).join('');
  nodes.channelsWrapper.innerHTML = DOMPurify.sanitize(`${channelsTitle}${channelsList}`);
};

export const handleModal = (nodes, state) => {
  const postId = state.openedPostId;
  const post = state.posts.find((el) => el.id === postId);
  nodes.modalTitle.textContent = post.title;
  nodes.modalBody.innerHTML = DOMPurify.sanitize(post.description);
  nodes.openFullArticle.href = post.link;
};

const disableFormNodes = (nodes) => {
  nodes.submitBtn.setAttribute('disabled', 'disabled');
  nodes.input.setAttribute('readonly', 'readonly');
};

const enableFormNodes = (nodes) => {
  nodes.input.removeAttribute('readonly');
  nodes.submitBtn.removeAttribute('disabled');
};

const clearFields = (nodes) => {
  nodes.input.classList.remove('is-invalid');
  nodes.feedbackField.classList.remove('text-danger');
  nodes.feedbackField.classList.remove('text-success');
  nodes.feedbackField.textContent = '';
  enableFormNodes(nodes);
};

const setErrorStyles = (nodes) => {
  nodes.input.classList.add('is-invalid');
  nodes.feedbackField.classList.remove('text-success');
  nodes.feedbackField.classList.add('text-danger');
};

const setSuccessStyles = (nodes) => {
  nodes.input.classList.remove('is-invalid');
  nodes.feedbackField.classList.remove('text-danger');
  nodes.feedbackField.classList.add('text-success');
};

const handleFeedbackField = (feedbackNode, key) => {
  feedbackNode.setAttribute('data-i18n', key);
  feedbackNode.textContent = i18n.t(key);
};

export const handleForm = (nodes, state) => {
  switch (state.form.status) {
    case formStatus.FILLING:
      clearFields(nodes);
      break;
    case formStatus.FAILURE:
      handleFeedbackField(nodes.feedbackField, `errors.${state.form.error}`);
      setErrorStyles(nodes);
      enableFormNodes(nodes);
      nodes.input.select();
      break;
    case formStatus.SUBMITTED:
      enableFormNodes(nodes);
      break;
    default:
      break;
  }
};

export const handleLoading = (nodes, state) => {
  switch (state.loading.status) {
    case loadingStatus.IDLE:
      enableFormNodes(nodes);
      break;
    case loadingStatus.IN_PROCESS:
      disableFormNodes(nodes);
      nodes.input.classList.remove('is-invalid');
      nodes.loadingWrapper.innerHTML = '<img src="https://i.gifer.com/embedded/download/9T0I.gif" alt="loading">';
      nodes.feedbackField.classList.remove('text-danger', 'text-success');
      handleFeedbackField(nodes.feedbackField, `messages.${loadingMsg.RSS_IS_LOADING}`);
      break;
    case loadingStatus.FAILURE:
      nodes.loadingWrapper.innerHTML = '';
      handleFeedbackField(nodes.feedbackField, `errors.${state.loading.error}`);
      setErrorStyles(nodes);
      enableFormNodes(nodes);
      nodes.input.select();
      break;
    case loadingStatus.SUCCESS:
      nodes.loadingWrapper.innerHTML = '';
      handleFeedbackField(nodes.feedbackField, `messages.${loadingMsg.RSS_HAS_BEEN_LOADED}`);
      setSuccessStyles(nodes);
      handleChannels(nodes, state);
      enableFormNodes(nodes);
      nodes.input.value = '';
      nodes.input.focus();
      break;
    default:
      break;
  }
};

export const handleLocalization = () => {
  const nodesToLocalize = document.querySelectorAll('[data-i18n]');
  nodesToLocalize.forEach((node) => {
    const i18nKey = node.getAttribute('data-i18n');
    node.textContent = i18n.t(i18nKey);
  });
};
