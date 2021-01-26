import i18n from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import watchState from './watcher.js';
import validateForm from './validation.js';
import resources from './locale/translations.js';
import parse from './parser.js';
import { loadingErr, formErr, status } from './constants.js';
import translate from './translation.js';

const corsLink = 'https://hexlet-allorigins.herokuapp.com/get?url=';
const RSS_TIMEOUT = 5000;

const addIds = (items, id, channelID) => items.map((item, i) => (
  { ...item, id: id + i, channelID }
));

const compareItems = (oldItems, newItems) => oldItems.link === newItems.link;

export const updateRss = (watcher) => {
  const rssPromises = watcher.rssChannels.map(({ id: channelID, url }) => axios
    .get(`${corsLink}${encodeURIComponent(url)}`)
    .then((res) => {
      const { rssItems } = parse(res.data.contents);
      const currentRssItems = watcher.rssItems.filter((item) => item.channelID === channelID);
      const newRssItems = _.differenceWith(rssItems, currentRssItems, compareItems);
      const newItemsWithIds = addIds(newRssItems, _.uniqueId(), channelID);
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

export const addRSS = (watcher, url) => {
  axios.get(`${corsLink}${encodeURIComponent(url)}`)
    .then((res) => {
      const feed = parse(res.data.contents);
      const channelID = _.uniqueId('channel');
      watcher.rssChannels.push({
        id: channelID,
        title: feed.rssChannel.chTitle,
        description: feed.rssChannel.chDescription,
        url,
      });
      watcher.currentRssChannelID = channelID;
      const { rssItems } = feed;
      const rssItemsWithID = addIds(rssItems, _.uniqueId(), channelID);
      watcher.rssItems.push(...rssItemsWithID);
      watcher.loading.error = null;
      watcher.loading.status = status.SUCCESS;
    })
    .catch((err) => {
      watcher.loading.error = err.message === loadingErr.URL_HAS_NO_RSS
        ? loadingErr.URL_HAS_NO_RSS
        : loadingErr.NETWORK_ERROR;
      watcher.loading.status = status.FAILURE;
    });
};

export default () => {
  i18n.init({
    lng: 'en',
    debug: false,
    resources,
  })
    .then(() => {
      yup.setLocale({
        mixed: {
          required: i18n.t(`errors.${formErr.FIELD_IS_REQUIRED}`),
        },
        string: {
          url: i18n.t(`errors.${formErr.URL}`),
          notOneOf: i18n.t(`errors.${formErr.URL_IS_ALREADY_IN_THE_LIST}`),
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
        openedItemId: null,
        loading: {
          status: status.IDLE,
          error: null,
        },
        currentRssChannelID: null,
        lng: i18n.language,
        form: {
          status: status.IDLE,
          isValid: false,
          error: null,
        },
      };

      translate(nodes, state);
      const watcher = watchState(state, nodes);
      updateRss(watcher);

      nodes.input.addEventListener('input', () => {
        watcher.form.status = status.FILLING;
      });
      nodes.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watcher.loading.status = status.IN_PROCESS;
        watcher.form.status = status.DISABLED;
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const error = validateForm(url, watcher);
        if (error) {
          watcher.form.isValid = false;
          watcher.form.error = error;
          watcher.form.status = status.SUBMITTED;
          watcher.loading.status = status.IDLE;
          return;
        }

        watcher.form.isValid = true;
        watcher.form.error = null;
        watcher.form.status = status.SUBMITTED;
        addRSS(watcher, url);
      });

      nodes.languages.forEach((lang) => {
        lang.addEventListener('click', (e) => {
          const { lng } = e.target.dataset;
          if (watcher.lng !== lng) {
            watcher.lng = lng;
          }
        });
      });

      nodes.rssWrapper.addEventListener('click', (e) => {
        const channelNode = e.composedPath().find((el) => el.dataset && el.dataset.channelId);
        if (channelNode && watcher.currentRssChannelID !== channelNode.dataset.channelId) {
          watcher.currentRssChannelID = channelNode.dataset.channelId;
          return;
        }
        const itemBtnNode = e.composedPath().find((el) => el.dataset && el.dataset.itemId);
        if (itemBtnNode) {
          const currentItemId = itemBtnNode.dataset.itemId;
          watcher.viewedRssItems.add(currentItemId);
          watcher.openedItemId = currentItemId;
        }
      });
    })
    .catch(console.error);
};
