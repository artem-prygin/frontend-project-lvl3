import i18n from 'i18next';
import render from './render.js';
import c from './constants.js';

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
  if (state.form.status === c.status.DISABLED) {
    nodes.submitBtn.setAttribute('disabled', 'disabled');
    nodes.input.setAttribute('readonly', 'readonly');
    return;
  }
  if (state.form.status === c.status.FILLING) {
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
  enableFormNodes(nodes);
  switch (state.loading.status) {
    case c.status.IDLE:
      render(nodes, state);
      break;
    case c.status.IN_PROCESS:
      nodes.rssWrapper.innerHTML = '<img src="https://i.gifer.com/embedded/download/9T0I.gif" alt="loading">';
      nodes.feedbackField.classList.remove('text-danger', 'text-success');
      nodes.feedbackField.textContent = i18n.t(`messages.${c.loadingMsg.RSS_IS_LOADING}`);
      break;
    case c.status.FAILURE:
      nodes.feedbackField.textContent = i18n.t(`errors.${state.loading.error}`);
      setErrorStyles(nodes);
      render(nodes, state);
      break;
    case c.status.SUCCESS:
      nodes.feedbackField.textContent = i18n.t(`messages.${c.loadingMsg.RSS_HAS_BEEN_LOADED}`);
      setSuccessStyles(nodes);
      render(nodes, state);
      break;
    default:
      break;
  }
};
