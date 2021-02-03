import DOMPurify from 'dompurify';
import i18n from 'i18next';
import {
  textContent,
  loadingMsg,
  formStatus,
  loadingStatus,
} from './constants.js';

const generateChannelsList = (channels, activeID) => {
  const titleHTML = `<h2 id="channelsTitle">${i18n.t(`rss.${textContent.CHANNELS_TITLE}`)}</h2>`;
  const channelsList = channels.map((channel) => {
    const activeClass = channel.id === activeID ? 'active' : '';
    return `<li class="list-group-item ${activeClass}" data-channel-id="${channel.id}" role="button">
            <h4 data-channel-id="${channel.id}">${channel.title}</h4>
            <small data-channel-id="${channel.id}">${channel.description}</small>
        </li>`;
  }).join('');
  return `${titleHTML}${channelsList}`;
};

const generatePostsList = (state, posts) => {
  const titleHTML = `<h2 id="postsTitle">${i18n.t(`rss.${textContent.FEED_TITLE}`)}</h2>`;
  const postsList = posts.map(({ id, title }) => {
    const isViewed = state.viewedPosts.has(id);
    const fontWeightClass = isViewed ? 'font-weight-normal' : 'font-weight-bold';
    const btnClass = isViewed ? 'btn-secondary' : 'btn-primary ';
    return `<li class="list-group-item d-flex justify-content-between align-items-start">
    <h5 class="${fontWeightClass}">${title}</h5>
    <button class="btn ${btnClass} modal-open flex-shrink-0" data-post-id="${id}" role="button"
        data-toggle="modal" data-target="#item-modal">${i18n.t(`rss.${textContent.OPEN_MODAL_BTN}`)}</button>
  </li>`;
  }).join('');
  return `${titleHTML}${postsList}`;
};

const getCurrentPosts = (posts, channelID) => posts
  .filter((post) => post.channelID === channelID);

export const handlePosts = (nodes, state) => {
  const { currentChannelID: channelID, posts } = state;
  const currentPosts = getCurrentPosts(posts, channelID);
  const postsDirtyHTML = generatePostsList(state, currentPosts);
  nodes.postsWrapper.innerHTML = DOMPurify.sanitize(postsDirtyHTML);
};

export const handleChannels = (nodes, state) => {
  const { currentChannelID: channelID, channels } = state;
  if (channels.length === 0) {
    return;
  }
  handlePosts(nodes, state);
  const channelsDirtyHTML = generateChannelsList(channels, channelID);
  nodes.channelsWrapper.innerHTML = DOMPurify.sanitize(channelsDirtyHTML);
};

export const handleModal = (nodes, state) => {
  const postId = state.openedPostId;
  const post = state.posts.find((el) => el.id === postId);
  nodes.modalTitle.textContent = post.title;
  nodes.modalBody.innerHTML = post.description;
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

export const handleForm = (nodes, state) => {
  switch (state.form.status) {
    case formStatus.FILLING:
      clearFields(nodes);
      break;
    case formStatus.FAILURE:
      nodes.feedbackField.textContent = i18n.t(`errors.${state.form.error}`);
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
      nodes.loadingWrapper.innerHTML = '<img src="https://i.gifer.com/embedded/download/9T0I.gif" alt="loading">';
      nodes.feedbackField.classList.remove('text-danger', 'text-success');
      nodes.feedbackField.textContent = i18n.t(`messages.${loadingMsg.RSS_IS_LOADING}`);
      break;
    case loadingStatus.FAILURE:
      nodes.loadingWrapper.innerHTML = '';
      nodes.feedbackField.textContent = i18n.t(`errors.${state.loading.error}`);
      setErrorStyles(nodes);
      enableFormNodes(nodes);
      nodes.input.select();
      state.loading.status = loadingStatus.IDLE;
      break;
    case loadingStatus.SUCCESS:
      nodes.loadingWrapper.innerHTML = '';
      nodes.feedbackField.textContent = i18n.t(`messages.${loadingMsg.RSS_HAS_BEEN_LOADED}`);
      setSuccessStyles(nodes);
      handleChannels(nodes, state);
      enableFormNodes(nodes);
      nodes.input.value = '';
      nodes.input.focus();
      state.loading.status = loadingStatus.IDLE;
      break;
    default:
      break;
  }
};
