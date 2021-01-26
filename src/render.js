import i18n from 'i18next';
import { textContent } from './constants.js';

const generateChannelsList = (channels, activeID) => channels.map((channel) => {
  const activeClass = channel.id === activeID ? 'active' : '';
  return `<li class="list-group-item ${activeClass}" data-channel-id="${channel.id}" role="button">
            <h4>${channel.title}</h4>
            <small>${channel.description}</small>
        </li>`;
}).join('');

const generateItemsList = (state, items) => items.map(({ id, title }) => {
  const isViewed = state.viewedRssItems.has(id);
  const fontWeightClass = isViewed
    ? 'font-weight-normal'
    : 'font-weight-bold';
  const btnClass = isViewed
    ? 'btn-secondary'
    : 'btn-primary ';
  return `<li class="list-group-item d-flex justify-content-between align-items-start">
    <h5 class="${fontWeightClass}">${title}</h5>
    <button class="btn ${btnClass} modal-open flex-shrink-0" data-item-id="${id}"
        data-toggle="modal" data-target="#item-modal">${i18n.t(`rss.${textContent.OPEN_MODAL_BTN}`)}</button>
  </li>`;
}).join('');

const generateRssTemplate = (state, currentItems, channels, currentChannelID) => `
  <div class="row">
    <div class="col-md-3">
        <h2 id="channelsTitle">${i18n.t(`rss.${textContent.CHANNELS_TITLE}`)}</h2>
        <ul class="list-group channels-list">
           ${generateChannelsList(channels, currentChannelID)}
        </ul>
    </div>
    <div class="col-md-9">
        <h2 id="feedTitle">${i18n.t(`rss.${textContent.FEED_TITLE}`)}</h2>
        <ul class="list-group items-list" id="items-wrapper">
            ${generateItemsList(state, currentItems)}
        </ul>
    </div>
  </div>
`;

const getCurrentItems = (items, channelId) => items
  .filter((item) => item.channelID === channelId);

export const render = (nodes, state) => {
  const { currentRssChannelID: channelId, rssItems, rssChannels } = state;
  if (rssChannels.length === 0) {
    nodes.rssWrapper.textContent = '';
    return;
  }
  const items = getCurrentItems(rssItems, channelId);
  nodes.rssWrapper.innerHTML = generateRssTemplate(state, items, rssChannels, channelId);
};

export const renderItems = (nodes, state) => {
  const { currentRssChannelID: channelId, rssItems } = state;
  const itemsWrapper = document.getElementById('items-wrapper');
  const items = getCurrentItems(rssItems, channelId);
  itemsWrapper.innerHTML = generateItemsList(state, items);
};

export const renderModal = (nodes, state) => {
  const itemId = state.openedItemId;
  const btn = document.querySelector(`button[data-item-id="${itemId}"]`);
  btn.classList.remove('btn-primary');
  btn.classList.add('btn-secondary');
  const title = btn.parentElement.querySelector('h5');
  title.classList.remove('font-weight-bold');
  title.classList.add('font-weight-normal');
  const item = state.rssItems.find((el) => el.id === itemId);
  nodes.modalTitle.textContent = item.title;
  nodes.modalBody.innerHTML = item.description;
  nodes.openFullArticle.href = item.link;
};
