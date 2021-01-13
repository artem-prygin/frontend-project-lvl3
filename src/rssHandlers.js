import axios from 'axios';
import _ from 'lodash';
import { state } from './watcher.js';
import render from './render.js';

const corsLink = 'https://api.allorigins.win/get?url=';

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
        const lastItem = _.last(currentItems);
        const lastID = lastItem.id;
        const { channelID } = lastItem;
        const itemsWithID = newFeed.map((item) => ({ ...item, id: lastID + 1, channelID }));
        state.items = [...state.items, ...itemsWithID];
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
  const startId = state.items.length > 0 ? _.last(state.items).id + 1 : 1;
  const itemsWithID = data.itemsData
    .map((item, i) => ({ ...item, id: i + startId + 1, channelID }));
  state.items = [...state.items, ...itemsWithID];
  setTimeout(() => {
    updateRss(url, channelID);
  }, 5000);
};
