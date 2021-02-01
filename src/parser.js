import { loadingErr } from './constants.js';

export default (rss) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(rss, 'application/xml');
  const isValidRSS = data.querySelector('parsererror') === null;
  if (!isValidRSS) {
    throw new Error(loadingErr.URL_HAS_NO_RSS);
  }
  const channelTitleNode = data.querySelector('channel > title');
  const channelTitle = channelTitleNode.textContent;
  const channelDescriptionNode = data.querySelector('channel > description');
  const channelDescription = channelDescriptionNode.textContent;
  const channel = { channelTitle, channelDescription };
  const items = data.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const itemNode = item.querySelector('title');
    const title = itemNode.textContent;
    const descriptionNode = item.querySelector('description');
    const description = descriptionNode.textContent;
    const linkNode = item.querySelector('link');
    const link = linkNode.textContent;
    return {
      title,
      description,
      link,
    };
  });
  return { channel, posts };
};
