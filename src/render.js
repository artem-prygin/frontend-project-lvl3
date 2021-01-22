import i18n from 'i18next';
import c from './constants.js';

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

const generateItemsList = (watchState, items) => items.map(({ id, title }) => {
  const isViewed = watchState.viewedRssItems.has(id);
  const fontWeightClass = isViewed
    ? 'font-weight-normal'
    : 'font-weight-bold';
  const btnClass = isViewed
    ? 'btn-secondary'
    : 'btn-primary ';
  return `<li class="list-group-item d-flex justify-content-between align-items-start">
    <h5 class="${fontWeightClass}">${title}</h5>
    <button class="btn ${btnClass} modal-open" data-item-id="${id}"
        data-toggle="modal" data-target="#item-modal">${i18n.t(`rss.${c.textContent.OPEN_MODAL_BTN}`)}</button>
  </li>`;
}).join('');

const generateRssTemplate = (watchState, currentItems, channels, currentChannelID) => `
  <div class="row">
    <div class="col-md-3">
        <h2 id="channelsTitle">${i18n.t(`rss.${c.textContent.CHANNELS_TITLE}`)}</h2>
        <ul class="list-group channels-list">
           ${generateChannelsList(channels, currentChannelID)}
        </ul>
    </div>
    <div class="col-md-9">
        <h2 id="feedTitle">${i18n.t(`rss.${c.textContent.FEED_TITLE}`)}</h2>
        <ul class="list-group items-list">
            ${generateItemsList(watchState, currentItems)}
        </ul>
    </div>
  </div>
`;

const clickOpenModalBtn = (nodes, watchState, btn) => {
  btn.addEventListener('click', () => {
    const { itemId } = btn.dataset;
    const item = watchState.rssItems.find(({ id }) => id === itemId);
    setModalInfo(nodes, item);
    watchState.viewedRssItems.add(itemId);
  });
};

const clickChannel = (nodes, watchState, channel) => {
  channel.addEventListener('click', (e) => {
    watchState.currentRssChannelID = e.target.dataset.id;
  });
};

const render = (nodes, watchState) => {
  const { currentRssChannelID: id, rssItems: items, rssChannels: channels } = watchState;
  if (channels.length === 0) {
    nodes.rssWrapper.textContent = '';
    return;
  }
  const currentItems = items
    .filter((item) => item.channelID === id)
    .sort((a, b) => b.id - a.id);
  nodes.rssWrapper.innerHTML = generateRssTemplate(watchState, currentItems, channels, id);

  const channelListNode = document.querySelector('.channels-list');
  const channelNodes = channelListNode.querySelectorAll('.list-group-item');
  channelNodes.forEach((channel) => clickChannel(nodes, watchState, channel));

  const openModalBtns = document.querySelectorAll('button[data-target="#item-modal"]');
  openModalBtns.forEach((btn) => clickOpenModalBtn(nodes, watchState, btn));
};

export default render;
