import i18n from 'i18next';
import nodes from './DOMelements.js';

const setModalInfo = (item) => {
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

const generateItemsList = (items) => items.map(({ id, title, viewed }) => {
  const fontWeightClass = viewed ? 'font-weight-normal' : 'font-weight-bold';
  const btnClass = viewed ? 'btn-secondary' : 'btn-primary ';
  return `<li class="list-group-item d-flex justify-content-between align-items-start">
    <h5 class="${fontWeightClass}">${title}</h5>
    <button class="btn ${btnClass} modal-open" data-item-id="${id}"
        data-toggle="modal" data-target="#item-modal">${i18n.t('rss.openModalBtn')}</button>
  </li>`;
}).join('');

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

const clickOpenModalBtn = (state, render, btn) => {
  btn.addEventListener('click', () => {
    const { itemId } = btn.dataset;
    const item = state.items.find(({ id }) => id === itemId);
    const index = state.items.findIndex(({ id }) => id === itemId);
    setModalInfo(item);
    if (!state.items[index].viewed) {
      const newState = state;
      newState.items[index].viewed = true;
      render(newState);
    }
  });
};

const clickChannel = (state, render, channel) => {
  channel.addEventListener('click', () => {
    if (state.currentChannelID !== channel.dataset.id) {
      const newState = state;
      newState.currentChannelID = channel.dataset.id;
      render(newState);
    }
  });
};

const render = (state) => {
  const { currentChannelID, items, channels } = state;
  if (state.channels.length === 0) {
    nodes.rssWrapper.textContent = '';
    return;
  }
  const currentItems = items
    .filter((item) => item.channelID === currentChannelID)
    .sort((a, b) => b.id - a.id);
  nodes.rssWrapper.innerHTML = generateRssTemplate(currentItems, channels, currentChannelID);

  const channelListNode = document.querySelector('.channels-list');
  const channelNodes = channelListNode.querySelectorAll('.list-group-item');
  channelNodes.forEach((channel) => clickChannel(state, render, channel));

  const openModalBtns = document.querySelectorAll('button[data-target="#item-modal"]');
  openModalBtns.forEach((btn) => clickOpenModalBtn(state, render, btn));
};

export default render;
