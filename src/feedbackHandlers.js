import render from './render.js';

export const handleError = (nodes, state, errorMessage) => {
  nodes.input.classList.add('is-invalid');
  nodes.feedbackField.classList.remove('text-success');
  nodes.feedbackField.classList.add('text-danger');
  nodes.feedbackField.textContent = errorMessage;
  nodes.submitBtn.removeAttribute('disabled');
  render(nodes, state);
};

export const handleSuccess = (nodes, state, successMessage) => {
  nodes.input.classList.remove('is-invalid');
  nodes.feedbackField.classList.remove('text-danger');
  nodes.feedbackField.classList.add('text-success');
  nodes.feedbackField.textContent = successMessage;
  nodes.submitBtn.removeAttribute('disabled');
  render(nodes, state);
};

export const handleLoading = (nodes, loadingMessage) => {
  nodes.submitBtn.setAttribute('disabled', 'disabled');
  nodes.rssWrapper.innerHTML = '<img src="https://i.gifer.com/embedded/download/9T0I.gif" alt="loading">';
  nodes.feedbackField.classList.remove('text-danger', 'text-success');
  nodes.feedbackField.textContent = loadingMessage;
};

export const clearFields = (nodes, state) => {
  nodes.input.classList.remove('is-invalid');
  nodes.feedbackField.classList.remove('text-danger');
  nodes.feedbackField.classList.remove('text-success');
  nodes.feedbackField.textContent = '';
  nodes.submitBtn.removeAttribute('disabled');
  state.feedbackMsg = null;
};
