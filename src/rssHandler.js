import axios from 'axios';
import _ from 'lodash';
import parser from './parser.js';
import { state } from './watcher.js';
import render from './render.js';

const corsLink = 'https://api.allorigins.win/get?url=';

export const getRss = (url) => axios.get(`${corsLink}${encodeURIComponent(url)}`)
  .then((res) => parser(res.data.contents))
  .catch(console.error);

const updateRss = (url, id) => {
  getRss(url)
    .then((feed) => {
      const currentItems = state.items.filter(({ channelID }) => channelID === id);
      const currentGuids = currentItems.map(({ guid }) => guid);
      const newFeed = feed.itemsData.filter(({ guid }) => !currentGuids.includes(guid));
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
  const itemsWithID = data.itemsData.map((item, index) => ({ ...item, id: index + 1, channelID }));
  state.items = [...state.items, ...itemsWithID];
  setTimeout(() => {
    updateRss(url, channelID);
  }, 5000);
};
