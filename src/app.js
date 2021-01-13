import _ from 'lodash';
import { watcher, state } from './watcher.js';
import validateForm from './validation.js';
import nodes from './DOMelements.js';
import { getRss, addRSS } from './rssHandler.js';

export default () => {
  watcher.formState = 'initializing';
  nodes.input.addEventListener('input', () => {
    watcher.formState = 'filling';
  });
  nodes.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const errors = validateForm({ url });
    if (!_.isEqual(errors, {})) {
      watcher.feedbackMsg = errors.url.type;
      watcher.formState = 'failure';
      return;
    }

    if (state.urls.includes(url)) {
      watcher.feedbackMsg = 'inTheList';
      watcher.formState = 'failure';
      return;
    }

    watcher.formState = 'submitted';
    getRss(url)
      .then((feed) => {
        if (_.isEqual(feed, {})) {
          watcher.feedbackMsg = 'noRss';
          watcher.formState = 'failure';
          return;
        }
        addRSS(url, feed);
        watcher.feedbackMsg = 'successMsg';
        watcher.formState = 'success';
      })
      .catch((err) => {
        console.error(err);
        watcher.feedbackMsg = 'networkError';
        watcher.formState = 'failure';
      });
  });

  nodes.languages.forEach((language) => {
    language.addEventListener('click', () => {
      const active = document.querySelector('.language-active');
      if (active === language) {
        return;
      }
      active.classList.remove('language-active');
      language.classList.add('language-active');
      watcher.lng = language.dataset.lng;
    });
  });
};
