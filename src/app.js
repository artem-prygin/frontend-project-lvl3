/* eslint no-param-reassign: 0 */
import i18n from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import watchState from './watcher.js';
import resources from './locale/translations.js';
import yupLocale from './locale/yupLocale.js';
import parse from './parser.js';
import {
  loadingErr,
  formStatus,
  loadingStatus,
  textContent,
} from './constants.js';

const RSS_TIMEOUT = 5000;

const corsLink = 'https://hexlet-allorigins.herokuapp.com/';
const addProxy = (url) => {
  const corsUrl = new URL('get', corsLink);
  corsUrl.searchParams.set('disableCache', 'true');
  corsUrl.searchParams.set('url', url);
  return corsUrl.toString();
};

const validateForm = (url, currentUrls) => {
  const schema = yup.string().required().url().notOneOf(currentUrls);
  try {
    schema.validateSync(url);
    return null;
  } catch (e) {
    return e.type;
  }
};

export const updateRss = (watcher) => {
  const rssPromises = watcher.channels.map(({ id: channelID, url }) => {
    const urlWithProxy = addProxy(url);
    return axios.get(urlWithProxy)
      .then((res) => {
        const { posts } = parse(res.data.contents);
        const currentPosts = watcher.posts.filter((item) => item.channelID === channelID);
        const newPostsWithIds = _.differenceWith(posts, currentPosts, (a, b) => a.link === b.link)
          .map((item) => ({ ...item, id: _.uniqueId(), channelID }));
        watcher.posts.unshift(...newPostsWithIds);
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
  const urlWithProxy = addProxy(url);
  axios.get(urlWithProxy)
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

export default () => i18n
  .init({
    lng: 'en',
    debug: false,
    resources,
  })
  .then(() => {
    yup.setLocale(yupLocale);

    const nodes = {
      channelsWrapper: document.getElementById('channels-wrapper'),
      postsWrapper: document.getElementById('posts-wrapper'),
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

    nodes.siteDescription.setAttribute('data-i18n', textContent.SITE_DESCRIPTION);
    nodes.submitBtn.setAttribute('data-i18n', textContent.SUBMIT_BTN);
    nodes.exampleUrl.setAttribute('data-i18n', textContent.EXAMPLE_URL);
    nodes.openFullArticle.setAttribute('data-i18n', textContent.OPEN_ARTICLE);
    nodes.closeModalBtn.setAttribute('data-i18n', textContent.CLOSE_MODAL_BTN);
    nodes.createdBy.setAttribute('data-i18n', textContent.CREATED_BY);

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
      lng: null,
      form: {
        status: formStatus.IDLE,
        isValid: false,
        error: null,
      },
    };

    const watcher = watchState(state, nodes);
    watcher.lng = i18n.language;
    updateRss(watcher);

    nodes.input.addEventListener('input', () => {
      watcher.form.status = formStatus.FILLING;
    });
    nodes.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watcher.loading.status = loadingStatus.IDLE;
      const formData = new FormData(e.target);
      const newUrl = formData.get('url');
      const currentUrls = watcher.channels.map(({ url }) => url);
      const error = validateForm(newUrl, currentUrls);
      if (error) {
        watcher.form.isValid = false;
        watcher.form.error = error;
        watcher.form.status = formStatus.FAILURE;
      } else {
        watcher.form.isValid = true;
        watcher.form.error = null;
        watcher.form.status = formStatus.SUBMITTED;
        addRSS(watcher, newUrl);
      }
    });

    nodes.languages.forEach((lang) => {
      lang.addEventListener('click', (e) => {
        nodes.languages.forEach((node) => node.classList.remove('language-active'));
        e.target.classList.add('language-active');
        const { lng } = e.target.dataset;
        if (lng && watcher.lng !== lng) {
          watcher.lng = lng;
        }
      });
    });

    nodes.channelsWrapper.addEventListener('click', (e) => {
      const { channelId } = e.target.dataset;
      if (channelId) {
        watcher.currentChannelID = channelId;
      }
    });

    nodes.postsWrapper.addEventListener('click', (e) => {
      const { postId } = e.target.dataset;
      if (postId) {
        watcher.viewedPosts.add(postId);
        watcher.openedPostId = postId;
      }
    });
  })
  .catch(console.error);
