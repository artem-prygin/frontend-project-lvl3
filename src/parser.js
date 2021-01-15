export default (rss) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(rss, 'application/xml');
  const isValidRSS = data.querySelector('rss') !== null;
  if (!isValidRSS) {
    throw new Error('noRss');
  }
  const { textContent: chTitle } = data.querySelector('channel > title');
  const { textContent: chDescription } = data.querySelector('channel > description');
  const channelInfo = { chTitle, chDescription };
  const items = data.querySelectorAll('item');
  const itemsData = [...items].map((item) => {
    const { textContent: title } = item.querySelector('title');
    const { textContent: description } = item.querySelector('description');
    const { textContent: link } = item.querySelector('link');
    return {
      title,
      description,
      link,
      viewed: false,
    };
  }).reverse();
  return { channelInfo, itemsData };
};
