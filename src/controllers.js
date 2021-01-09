import axios from 'axios';

const form = document.querySelector('form');

export default () => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    axios.get('https://cors-anywhere.herokuapp.com/http://lorem-rss.herokuapp.com/feed')
      .then((res) => console.log(res, 43))
  });
};
