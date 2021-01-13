import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/util.js';
import 'bootstrap/js/dist/alert.js';
import './assets/css/style.css';
import './assets/img/favicon.png';
import joke from './assets/img/joke.png';
import loading from './assets/img/loading.gif';
import esFlag from './assets/img/es.webp';
import enFlag from './assets/img/gb.webp';
import ruFlag from './assets/img/ru.webp';
import app from './app.js';

const enFlagImg = document.querySelector('.language[data-lng="en"] > img');
const ruFlagImg = document.querySelector('.language[data-lng="ru"] > img');
const esFlagImg = document.querySelector('.language[data-lng="es"] > img');
const jokeNode = document.querySelector('.joke > img');
enFlagImg.src = enFlag;
ruFlagImg.src = ruFlag;
esFlagImg.src = esFlag;
jokeNode.src = joke;

app();

export const loadingGif = loading;
