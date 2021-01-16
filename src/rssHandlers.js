import axios from 'axios';
import _ from 'lodash';
import parser from './parser.js';

export const corsLink = 'https://api.allorigins.win/get?url=';

const addIds = (items, channelID) => items.map((item) => (
  { ...item, id: _.uniqueId(), channelID }
));

const addItems = (watcher, items, channelID) => {
  const itemsWithID = addIds(items, channelID);
  watcher.items = [...watcher.items, ...itemsWithID];
};

export const updateRss = (watcher) => {
  const items = watcher.channels.flatMap(({ id: channelID, url }) => axios
    .get(`${corsLink}${encodeURIComponent(url)}`)
    .then((res) => {
      const { itemsData } = parser(res.data.contents);
      const itemsDataWithIds = addIds(itemsData, channelID);
      const { items: currentItems } = watcher;
      watcher.items = _.unionBy(currentItems, itemsDataWithIds, 'link');
    })
    .catch(console.error));

  Promise.all(items)
    .then((res) => {
      setTimeout(() => {
        updateRss(watcher);
      }, 5000);

      if (res.length === 0) {
        return;
      }
      watcher.lastRssUpdate = new Date();
    });
};

export const addRSS = (watcher, url, data) => {
  const newWatcher = watcher;
  const channelID = _.uniqueId('channel');
  newWatcher.channels.push({
    id: channelID,
    title: data.channelInfo.chTitle,
    description: data.channelInfo.chDescription,
    url,
  });
  newWatcher.currentChannelID = channelID;
  addItems(newWatcher, data.itemsData, channelID);
};
