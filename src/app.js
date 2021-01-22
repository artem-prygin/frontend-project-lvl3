import i18n from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import watchState from './watcher.js';
import validateForm from './validation.js';
import resources from './locale/translations.js';
import parse from './parser.js';
import c from './constants.js';
import translate from './translation.js';

const corsLink = 'https://hexlet-allorigins.herokuapp.com/get?url=';
const RSS_TIMEOUT = 5000;

const addIds = (items, channelID) => items.map((item) => (
  { ...item, id: _.uniqueId(), channelID }
));

export const updateRss = (watcher) => {
  const rssPromises = watcher.rssChannels.map(({ id: channelID, url }) => axios
    .get(`${corsLink}${encodeURIComponent(url)}`)
    .then((res) => {
      const { rssItems } = parse(res.data.contents);
      const currentRssItems = watcher.rssItems.filter((item) => item.channelID === channelID);
      const currentLinks = currentRssItems.map(({ link }) => link);
      const newRssItems = rssItems.filter(({ link }) => !currentLinks.includes(link));
      const newItemsWithIds = addIds(newRssItems, channelID);
      watcher.rssItems.unshift(...newItemsWithIds);
    })
    .catch(console.error));

  Promise.all(rssPromises)
    .finally(() => {
      setTimeout(() => {
        updateRss(watcher);
      }, RSS_TIMEOUT);
    });
};

export const addRSS = (state, url, data) => {
  const channelID = _.uniqueId('channel');
  state.rssChannels.push({
    id: channelID,
    title: data.rssChannel.chTitle,
    description: data.rssChannel.chDescription,
    url,
  });
  state.currentRssChannelID = channelID;
  const { rssItems } = data;
  const rssItemsWithID = addIds(rssItems, channelID);
  state.rssItems.push(...rssItemsWithID);
};

export default () => {
  i18n.init({
    lng: 'en',
    debug: true,
    resources,
  })
    .then(() => {
      yup.setLocale({
        mixed: {
          required: i18n.t(`errors.${c.formErrors.FIELD_IS_REQUIRED}`),
        },
        string: {
          url: i18n.t(`errors.${c.formErrors.URL}`),
          notOneOf: i18n.t(`errors.${c.formErrors.URL_IS_ALREADY_IN_THE_LIST}`),
        },
      });

      const nodes = {
        rssWrapper: document.querySelector('.rss-wrapper'),
        form: document.querySelector('form'),
        input: document.querySelector('input[name="url"]'),
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
        viewedRssItems: new Set(),
        loading: {
          status: c.status.IDLE,
          error: null,
        },
        currentRssChannelID: null,
        lng: i18n.language,
        form: {
          status: c.status.IDLE,
          isValid: false,
          error: null,
        },
      };
      translate(nodes, state);
      const watcher = watchState(state, nodes);
      updateRss(watcher);

      nodes.input.addEventListener('input', () => {
        watcher.form.status = c.status.FILLING;
      });
      nodes.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watcher.loading.status = c.status.IN_PROCESS;
        watcher.form.status = c.status.DISABLED;
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const error = validateForm(url, watcher);
        if (error) {
          watcher.form.isValid = false;
          watcher.form.error = error;
          watcher.form.status = c.status.SUBMITTED;
          watcher.loading.status = c.status.IDLE;
          return;
        }
        watcher.form.isValid = true;
        watcher.form.error = null;
        watcher.form.status = c.status.SUBMITTED;

        axios.get(`${corsLink}${encodeURIComponent(url)}`)
          .then((res) => {
            const feed = parse(res.data.contents);
            addRSS(state, url, feed);
            watcher.loading.error = null;
            watcher.loading.status = c.status.SUCCESS;
          })
          .catch((err) => {
            if (err.message === c.loadingErr.URL_HAS_NO_RSS) {
              watcher.loading.error = c.loadingErr.URL_HAS_NO_RSS;
              watcher.loading.status = c.status.FAILURE;
              return;
            }
            watcher.loading.error = c.loadingErr.NETWORK_ERROR;
            watcher.loading.status = c.status.FAILURE;
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
    })
    .catch(console.error);
};
