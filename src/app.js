import i18n from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import watchState from './watcher.js';
import validateForm from './validation.js';
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
          required: i18n.t('errors.required'),
        },
        string: {
          url: i18n.t('errors.url'),
          notOneOf: i18n.t('errors.inTheList'),
        },
      });

      const nodes = {
        rssWrapper: document.querySelector('.rss-wrapper'),
        form: document.querySelector('form'),
        input: document.querySelector('input[type="url"]'),
        languages: document.querySelectorAll('.language'),
        submitBtn: document.querySelector('button[type="submit"]'),
        siteDescription: document.querySelector('.site-description'),
        exampleUrl: document.querySelector('.example-url'),
        feedbackField: document.querySelector('.feedback'),
        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        openFullArticle: document.querySelector('.open-full-article'),
        closeModalBtn: document.querySelector('.close-modal-btn'),
        createdBy: document.querySelector('.created-by'),
      };

      const state = {
        channels: [],
        items: [],
        currentChannelID: null,
        formState: '',
        lastRssUpdate: null,
        lng: i18n.language,
        error: null,
      };

      const watcher = watchState(nodes, state);
      watcher.formState = 'initializing';
      updateRss(watcher);

      nodes.input.addEventListener('input', () => {
        watcher.formState = 'filling';
      });
      nodes.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const errors = validateForm({ url }, watcher);
        if (errors) {
          watcher.error = errors.url.type;
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
