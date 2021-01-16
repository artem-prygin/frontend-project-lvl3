import axios from 'axios';
import _ from 'lodash';
import parser from './parser.js';

export const corsLink = 'https://api.allorigins.win/get?url=';

const addIds = (items, channelID) => items.map((item) => (
  { ...item, id: _.uniqueId(), channelID }
));

export const updateRss = (watcher) => {
  const checkNewRss = watcher.rssChannels.forEach(({ id: channelID, url }) => axios
    .get(`${corsLink}${encodeURIComponent(url)}`)
    .then((res) => {
      const { rssItems } = parser(res.data.contents);
      const rssItemsWithIds = addIds(rssItems, channelID);
      const currentRssItems = watcher.rssItems.filter((item) => item.channelID === channelID);
      const newRssItems = _.xorBy(rssItemsWithIds, currentRssItems, 'link');
      if (newRssItems.length > 0) {
        watcher.rssItems.push(...newRssItems);
      }
    })
    .catch(console.error));

  Promise.all([checkNewRss])
    .then(() => {
      setTimeout(() => {
        updateRss(watcher);
      }, 5000);
    });
};

export const addRSS = (watcher, url, data) => {
  const channelID = _.uniqueId('channel');
  watcher.rssChannels.push({
    id: channelID,
    title: data.rssChannel.chTitle,
    description: data.rssChannel.chDescription,
    url,
  });
  watcher.currentRssChannelID = channelID;
  const rssItems = data.rssItems.reverse();
  const rssItemsWithID = addIds(rssItems, channelID);
  watcher.rssItems = [...watcher.rssItems, ...rssItemsWithID];
};
