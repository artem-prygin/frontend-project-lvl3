import i18n from 'i18next';
import constants from './constants.js';

const setModalInfo = (nodes, item) => {
  nodes.modalTitle.textContent = item.title;
  nodes.modalBody.innerHTML = item.description;
  nodes.openFullArticle.href = item.link;
};

const generateChannelsList = (channels, activeID) => channels.map((channel) => {
  const activeClass = channel.id === activeID ? 'active' : '';
  return `<li class="list-group-item ${activeClass}" data-id="${channel.id}" role="button">
            <h4>${channel.title}</h4>
            <small>${channel.description}</small>
        </li>`;
}).join('');

const generateItemsList = (items) => items.map(({ id, title, isViewed }) => {
  const fontWeightClass = isViewed ? 'font-weight-normal' : 'font-weight-bold';
  const btnClass = isViewed ? 'btn-secondary' : 'btn-primary ';
  return `<li class="list-group-item d-flex justify-content-between align-items-start">
    <h5 class="${fontWeightClass}">${title}</h5>
    <button class="btn ${btnClass} modal-open" data-item-id="${id}"
        data-toggle="modal" data-target="#item-modal">${i18n.t(`rss.${constants.OPEN_MODAL_BTN}`)}</button>
  </li>`;
}).join('');

const generateRssTemplate = (currentItems, channels, currentChannelID) => `
  <div class="row">
    <div class="col-md-3">
        <h2 id="channelsTitle">${i18n.t(`rss.${constants.CHANNELS_TITLE}`)}</h2>
        <ul class="list-group channels-list">
           ${generateChannelsList(channels, currentChannelID)}
        </ul>
    </div>
    <div class="col-md-9">
        <h2 id="feedTitle">${i18n.t(`rss.${constants.FEED_TITLE}`)}</h2>
        <ul class="list-group items-list">
            ${generateItemsList(currentItems)}
        </ul>
    </div>
  </div>
`;

const clickOpenModalBtn = (nodes, state, render, btn) => {
  btn.addEventListener('click', () => {
    const { itemId } = btn.dataset;
    const item = state.rssItems.find(({ id }) => id === itemId);
    const index = state.rssItems.findIndex(({ id }) => id === itemId);
    setModalInfo(nodes, item);
    if (!state.rssItems[index].isViewed) {
      state.rssItems[index].isViewed = true;
      render(nodes, state);
    }
  });
};

const clickChannel = (nodes, state, render, channel) => {
  channel.addEventListener('click', () => {
    if (state.currentRssChannelID !== channel.dataset.id) {
      const newState = state;
      newState.currentRssChannelID = channel.dataset.id;
      render(nodes, newState);
    }
  });
};

const render = (nodes, state) => {
  const { currentRssChannelID, rssItems, rssChannels } = state;
  if (state.rssChannels.length === 0) {
    nodes.rssWrapper.textContent = '';
    return;
  }
  const currentItems = rssItems
    .filter((item) => item.channelID === currentRssChannelID)
    .sort((a, b) => b.id - a.id);
  nodes.rssWrapper.innerHTML = generateRssTemplate(currentItems, rssChannels, currentRssChannelID);

  const channelListNode = document.querySelector('.channels-list');
  const channelNodes = channelListNode.querySelectorAll('.list-group-item');
  channelNodes.forEach((channel) => clickChannel(nodes, state, render, channel));

  const openModalBtns = document.querySelectorAll('button[data-target="#item-modal"]');
  openModalBtns.forEach((btn) => clickOpenModalBtn(nodes, state, render, btn));
};

export default render;
