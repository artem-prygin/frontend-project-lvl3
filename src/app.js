import _ from 'lodash';
import i18n from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import watchState from './watcher.js';
import validateForm from './validation.js';
import nodes from './DOMelements.js';
import { corsLink, addRSS, updateRss } from './rssHandlers.js';
import resources from './locale/translations.js';
import parser from './parser.js';

export default () => {
  i18n.init({
    lng: 'en',
    debug: false,
    resources,
  })
    .then(() => {
      yup.setLocale({
        mixed: {
          required: i18n.t('feedbackMsg.required'),
        },
        string: {
          url: i18n.t('feedbackMsg.url'),
        },
      });

      const state = {
        channels: [],
        items: [],
        currentChannelID: null,
        formState: '',
        lastRssUpdate: null,
        lng: i18n.language,
        error: null,
      };

      const watcher = watchState(state);
      watcher.formState = 'initializing';
      updateRss(watcher);

      nodes.input.addEventListener('input', () => {
        watcher.formState = 'filling';
      });
      nodes.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const errors = validateForm({ url });
        if (!_.isEqual(errors, {})) {
          watcher.error = errors.url.type;
          watcher.formState = 'failure';
          return;
        }

        const urlInTheList = watcher.channels.find((channel) => channel.url === url);
        if (urlInTheList) {
          watcher.error = 'inTheList';
          watcher.formState = 'failure';
          return;
        }

        watcher.formState = 'submitted';
        axios.get(`${corsLink}${encodeURIComponent(url)}`)
          .then((res) => {
            const feed = parser(res.data.contents);
            addRSS(watcher, url, feed);
            watcher.formState = 'success';
          })
          .catch((err) => {
            console.error(err);
            if (err.message === 'noRss') {
              watcher.error = 'noRss';
              watcher.formState = 'failure';
              return;
            }
            watcher.error = 'networkError';
            watcher.formState = 'failure';
          });
      });

      nodes.languages.forEach((lang) => {
        lang.addEventListener('click', () => {
          const active = document.querySelector('.language-active');
          if (active === lang) {
            return;
          }
          active.classList.remove('language-active');
          lang.classList.add('language-active');
          watcher.lng = lang.dataset.lng;
        });
      });
    });
};
