import axios from 'axios';
import _ from 'lodash';
import { state } from './watcher.js';
import render from './render.js';

const corsLink = 'https://api.allorigins.win/get?url=';

const addItems = (items, channelID) => {
  const startId = state.items.length > 0 ? _.last(state.items).id + 1 : 1;
  const itemsWithID = items
    .map((item, i) => ({ ...item, id: i + startId, channelID }));
  state.items = [...state.items, ...itemsWithID];
};

export const parseRss = (rss) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(rss, 'application/xml');
  const isValidRSS = data.querySelector('rss') !== null;
  if (!isValidRSS) {
    return {};
  }
  const channelTitle = data.querySelector('channel > title').textContent;
  const items = data.querySelectorAll('item');
  const itemsData = [...items].map((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    return {
      title,
      description,
      link,
      viewed: false,
    };
  });
  return { channelTitle, itemsData };
};

export const getRss = (url) => axios.get(`${corsLink}${encodeURIComponent(url)}`)
  .then((res) => parseRss(res.data.contents))
  .catch(console.error);

const updateRss = (url, id) => {
  getRss(url)
    .then((feed) => {
      const currentItems = state.items.filter(({ channelID }) => channelID === id);
      const currentLinks = currentItems.map(({ link }) => link);
      const newFeed = feed.itemsData.filter(({ link }) => !currentLinks.includes(link));
      if (newFeed.length > 0) {
        const { channelID } = _.last(currentItems);
        addItems(newFeed, channelID);
        render(state);
      }
    })
    .catch(console.error);

  setTimeout(() => {
    updateRss(url, id);
  }, 5000);
};

export const addRSS = (url, data) => {
  state.urls.push(url);
  const channelID = state.channels.length ? state.channels.length + 1 : 1;
  state.channels.push({ title: data.channelTitle, id: channelID });
  state.currentChannelID = channelID;
  addItems(data.itemsData, channelID);
  setTimeout(() => {
    updateRss(url, channelID);
  }, 5000);
};
