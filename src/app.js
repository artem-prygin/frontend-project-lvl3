import i18n from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import watchState from './watcher.js';
import validateForm from './validation.js';
import { corsLink, addRSS, updateRss } from './rssHandlers.js';
import resources from './locale/translations.js';
import parser from './parser.js';
import constants from './constants.js';

export default () => {
  i18n.init({
    lng: 'en',
    debug: false,
    resources,
  })
    .then(() => {
      yup.setLocale({
        mixed: {
          required: i18n.t(`errors.${constants.FIELD_IS_REQUIRED}`),
        },
        string: {
          url: i18n.t(`errors.${constants.URL}`),
          notOneOf: i18n.t(`errors.${constants.URL_IS_ALREADY_IN_THE_LIST}`),
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
        rssChannels: [],
        rssItems: [],
        currentRssChannelID: null,
        formState: '',
        lng: i18n.language,
        errors: {
          rssSearch: null,
        },
      };

      const watcher = watchState(nodes, state);
      watcher.formState = constants.INITIALIZING;
      updateRss(watcher);

      nodes.input.addEventListener('input', () => {
        watcher.formState = constants.FILLING;
      });
      nodes.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const error = validateForm(url, watcher);
        if (error) {
          watcher.errors.rssSearch = error;
          watcher.formState = constants.FAILURE;
          return;
        }

        watcher.formState = constants.SUBMITTED;
        axios.get(`${corsLink}${encodeURIComponent(url)}`)
          .then((res) => {
            const feed = parser(res.data.contents);
            addRSS(watcher, url, feed);
            watcher.formState = constants.SUCCESS;
          })
          .catch((err) => {
            if (err.message === constants.URL_HAS_NO_RSS) {
              watcher.errors.rssSearch = constants.URL_HAS_NO_RSS;
              watcher.formState = constants.FAILURE;
              return;
            }
            watcher.errors.rssSearch = constants.NETWORK_ERROR;
            watcher.formState = constants.FAILURE;
          });
      });

      nodes.languages.forEach((lang) => {
        lang.addEventListener('click', (e) => {
          const { lng } = e.target.dataset;
          if (watcher.lng === lng) {
            return;
          }
          watcher.lng = lng;
        });
      });
    });
};
