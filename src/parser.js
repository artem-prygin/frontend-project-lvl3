export default (rss) => {
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
    const guid = item.querySelector('guid').textContent;
    return {
      title,
      description,
      link,
      guid,
    };
  });
  return { channelTitle, itemsData };
};
