import i18n from 'i18next';
import { render } from './render.js';
import { loadingMsg, status } from './constants.js';

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
  if (state.form.status === status.DISABLED) {
    disableFormNodes(nodes);
    return;
  }
  if (state.form.status === status.FILLING) {
    clearFields(nodes);
    return;
  }
  if (!state.form.isValid) {
    nodes.feedbackField.textContent = i18n.t(`errors.${state.form.error}`);
    setErrorStyles(nodes);
    enableFormNodes(nodes);
    return;
  }
  enableFormNodes(nodes);
};

export const handleLoading = (nodes, state) => {
  switch (state.loading.status) {
    case status.IDLE:
      render(nodes, state);
      enableFormNodes(nodes);
      break;
    case status.IN_PROCESS:
      disableFormNodes(nodes);
      nodes.rssWrapper.innerHTML = '<img src="https://i.gifer.com/embedded/download/9T0I.gif" alt="loading">';
      nodes.feedbackField.classList.remove('text-danger', 'text-success');
      nodes.feedbackField.textContent = i18n.t(`messages.${loadingMsg.RSS_IS_LOADING}`);
      break;
    case status.FAILURE:
      nodes.feedbackField.textContent = i18n.t(`errors.${state.loading.error}`);
      setErrorStyles(nodes);
      render(nodes, state);
      enableFormNodes(nodes);
      break;
    case status.SUCCESS:
      nodes.feedbackField.textContent = i18n.t(`messages.${loadingMsg.RSS_HAS_BEEN_LOADED}`);
      setSuccessStyles(nodes);
      render(nodes, state);
      enableFormNodes(nodes);
      break;
    default:
      break;
  }
};
