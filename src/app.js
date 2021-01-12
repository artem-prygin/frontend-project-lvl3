import axios from 'axios';
import _ from 'lodash';
import parser from './parser.js';
import { watcher, validateForm, addRSS } from './watcher.js';
import nodes from './DOMelements.js';

const corsLink = 'https://api.allorigins.win/get?url=';

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

    if (watcher.urls.includes(url)) {
      watcher.feedbackMsg = 'inTheList';
      watcher.formState = 'failure';
      return;
    }

    watcher.formState = 'submitted';
    axios.get(`${corsLink}${encodeURIComponent(url)}`)
      .then((res) => {
        const feed = parser(res.data.contents);
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
