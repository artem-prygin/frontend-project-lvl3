import i18n from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import watchState from './watcher.js';
import resources from './locale/translations.js';
import parse from './parser.js';
import {
  loadingErr,
  formErr,
  formStatus,
  loadingStatus,
} from './constants.js';
import translate from './translation.js';

const corsLink = 'https://hexlet-allorigins.herokuapp.com/';
const corsUrl = new URL('get', corsLink);
corsUrl.searchParams.set('disableCache', 'true');
const RSS_TIMEOUT = 5000;

const validateForm = (link, watcher) => {
  const currentUrls = watcher.channels.map(({ url }) => url);
  const schema = yup.string().required().url().notOneOf(currentUrls);
  try {
    schema.validateSync(link);
    return null;
  } catch (e) {
    return e.type;
  }
};

export const updateRss = (watcher) => {
  const rssPromises = watcher.channels.map(({ id: channelID, url }) => {
    corsUrl.searchParams.set('url', url);
    return axios.get(corsUrl)
      .then((res) => {
        const { posts } = parse(res.data.contents);
        const currentPosts = watcher.posts.filter((item) => item.channelID === channelID);
        const newPosts = _.differenceWith(posts, currentPosts, (a, b) => a.link === b.link);
        const newItemsWithIds = newPosts.map((item) => ({ ...item, id: _.uniqueId(), channelID }));
        watcher.posts.unshift(...newItemsWithIds);
      })
      .catch(console.log);
  });

  Promise.all(rssPromises)
    .finally(() => {
      setTimeout(() => {
        updateRss(watcher);
      }, RSS_TIMEOUT);
    });
};

export const addRSS = (watcher, url) => {
  watcher.loading.status = loadingStatus.IN_PROCESS;
  corsUrl.searchParams.set('url', url);
  axios.get(corsUrl)
    .then((res) => {
      const { posts, channel } = parse(res.data.contents);
      const channelID = _.uniqueId('channel');
      watcher.channels.push({
        id: channelID,
        title: channel.channelTitle,
        description: channel.channelDescription,
        url,
      });
      watcher.currentChannelID = channelID;
      const postsWithID = posts.map((item) => ({ ...item, id: _.uniqueId(), channelID }));
      watcher.posts.push(...postsWithID);
      watcher.loading.error = null;
      watcher.loading.status = loadingStatus.SUCCESS;
    })
    .catch((err) => {
      watcher.loading.error = err.message === loadingErr.URL_HAS_NO_RSS
        ? loadingErr.URL_HAS_NO_RSS
        : loadingErr.NETWORK_ERROR;
      watcher.loading.status = loadingStatus.FAILURE;
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
        loadingWrapper: document.querySelector('.loading-wrapper'),
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
        channels: [],
        posts: [],
        viewedPosts: new Set(),
        openedPostId: null,
        loading: {
          status: loadingStatus.IDLE,
          error: null,
        },
        currentChannelID: null,
        lng: i18n.language,
        form: {
          status: formStatus.IDLE,
          isValid: false,
          error: null,
        },
      };

      translate(nodes, state);
      const watcher = watchState(state, nodes);
      updateRss(watcher);

      nodes.input.addEventListener('input', () => {
        watcher.form.status = formStatus.FILLING;
      });
      nodes.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watcher.form.status = formStatus.DISABLED;
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const error = validateForm(url, watcher);
        if (error) {
          watcher.form.isValid = false;
          watcher.form.error = error;
          watcher.form.status = formStatus.FAILURE;
        } else {
          watcher.form.isValid = true;
          watcher.form.error = null;
          watcher.form.status = formStatus.SUBMITTED;
          addRSS(watcher, url);
        }
      });

      nodes.languages.forEach((lang) => {
        lang.addEventListener('click', (e) => {
          const { lng } = e.target.dataset;
          if (lng && watcher.lng !== lng) {
            watcher.lng = lng;
          }
        });
      });

      nodes.rssWrapper.addEventListener('click', (e) => {
        const channelNode = e.composedPath().find((el) => el.dataset && el.dataset.channelId);
        if (channelNode && watcher.currentChannelID !== channelNode.dataset.channelId) {
          watcher.currentChannelID = channelNode.dataset.channelId;
        }
      });

      nodes.rssWrapper.addEventListener('click', (e) => {
        const postBtnNode = e.composedPath().find((el) => el.dataset && el.dataset.postId);
        if (postBtnNode) {
          const currentPostId = postBtnNode.dataset.postId;
          watcher.viewedPosts.add(currentPostId);
          watcher.openedPostId = currentPostId;
        }
      });
    })
    .catch(console.error);
};
