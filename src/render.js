import nodes from './DOMelements.js';
import { i18nObj as i18n } from './languagesHandler.js';

const generateChannelsList = (channels, activeID) => channels.map(({ title, id }) => {
  const activeClass = id === activeID ? 'active' : '';
  return `<li class="list-group-item ${activeClass}" data-id="${id}" role="button">${title}</li>`;
}).join('');

const generateItemsList = (items) => items.map(({ title }) => `
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <h5 class="font-weight-bold" role="button">${title}</h5>
    <button class="btn btn-primary modal-open">${i18n.t('rss.openModalBtn')}</button>
  </li>
`).join('');

const generateRssTemplate = (currentItems, channels, currentChannelID) => `
  <div class="row">
    <div class="col-md-3">
        <h2 id="channelsTitle">${i18n.t('rss.channelsTitle')}</h2>
        <ul class="list-group channels-list">
           ${generateChannelsList(channels, currentChannelID)}
        </ul>
    </div>
    <div class="col-md-9">
        <h2 id="feedTitle">${i18n.t('rss.feedTitle')}</h2>
        <ul class="list-group items-list">
            ${generateItemsList(currentItems)}
        </ul>
    </div>
  </div>
`;

const render = (state) => {
  const currentState = state;
  const { currentChannelID, items, channels } = state;
  if (state.channels.length === 0) {
    nodes.rssWrapper.textContent = '';
    return;
  }
  const currentItems = items.filter((item) => item.channelID === currentChannelID);
  nodes.rssWrapper.innerHTML = generateRssTemplate(currentItems, channels, currentChannelID);

  const channelListNode = document.querySelector('.channels-list');
  const channelNodes = channelListNode.querySelectorAll('.list-group-item');
  channelNodes.forEach((channel) => {
    channel.addEventListener('click', () => {
      if (state.currentChannelID === +channel.dataset.id) {
        return;
      }
      currentState.currentChannelID = +channel.dataset.id;
      render(currentState);
    });
  });
};

export default render;
