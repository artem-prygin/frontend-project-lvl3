const urlInput = document.querySelector('input[name="url"]');
const feedbackField = document.querySelector('.feedback');
const submitBtn = document.querySelector('button');

export const handleError = (errorMessage) => {
  urlInput.classList.add('is-invalid');
  feedbackField.classList.remove('text-success');
  feedbackField.classList.add('text-danger');
  feedbackField.textContent = errorMessage;
  submitBtn.removeAttribute('disabled');
};

export const handleSuccess = (successMessage) => {
  urlInput.classList.remove('is-invalid');
  feedbackField.classList.remove('text-danger');
  feedbackField.classList.add('text-success');
  feedbackField.textContent = successMessage;
  submitBtn.removeAttribute('disabled');
};

export const clearFields = () => {
  urlInput.classList.remove('is-invalid');
  feedbackField.classList.remove('text-danger');
  feedbackField.classList.remove('text-success');
  feedbackField.textContent = '';
  submitBtn.removeAttribute('disabled');
};
