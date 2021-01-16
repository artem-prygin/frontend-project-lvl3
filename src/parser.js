import constants from './constants.js';

export default (rss) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(rss, 'application/xml');
  const isValidRSS = data.querySelector('rss') !== null;
  if (!isValidRSS) {
    throw new Error(constants.URL_HAS_NO_RSS);
  }
  const chTitleNode = data.querySelector('channel > title');
  const chTitle = chTitleNode.textContent;
  const chDescriptionNode = data.querySelector('channel > description');
  const chDescription = chDescriptionNode.textContent;
  const rssChannel = { chTitle, chDescription };
  const items = data.querySelectorAll('item');
  const rssItems = [...items].map((item) => {
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
      isViewed: false,
    };
  });
  return { rssChannel, rssItems };
};
