import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import uniqueId from 'lodash.uniqueid';
import parser from './parser.js';
import render from './render.js';
import resources from './locales/index.js';

const createUrl = (link) => {
  const url = new URL('https://allorigins.hexlet.app/get');
  url.searchParams.set('disableCache', 'true');
  url.searchParams.set('url', link);
  return url.href;
};

const addNewPosts = (state) => { // https://lorem-rss.herokuapp.com/feed?unit=second
  setTimeout(() => {
    const promisesPosts = state.feeds.map(({ url }) => axios.get(createUrl(url))
      .then((response) => {
        const { posts } = parser(response.data.contents);
        const newPosts = posts
          .filter((post) => !state.posts.some((existingPost) => existingPost.url === post.url));
        const updatedPosts = newPosts.map((post) => ({ ...post, id: uniqueId() }));
        state.posts.unshift(...updatedPosts);
      })
      .catch(() => {}));
    Promise.all(promisesPosts).finally(() => addNewPosts(state));
  }, 5000);
};

export default () => {
  yup.setLocale({
    mixed: {
      notOneOf: 'rssAlredyWas',
    },
    string: {
      url: 'invalidUrl',
    },
  });

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const elements = {
    urlInput: document.querySelector('#url-input'),
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: {
      modalTitle: document.querySelector('.modal-title'),
      modalDescription: document.querySelector('.modal-body'),
      linkRead: document.querySelector('.full-article'),
    },
  };

  const initialState = {
    loading: {
      condition: 'initial',
      error: null,
    },
    form: {
      condition: 'initial',
      error: null,
    },
    feeds: [],
    posts: [],
    uiState: {
      modalId: '',
      viewed: new Set(),
    },
  };

  const utils = render(elements, initialState, i18nInstance);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    utils.form.condition = 'processing';
    const allUrls = initialState.feeds.map((el) => el.url);
    const validateUrl = yup.string().url().notOneOf(allUrls);
    validateUrl
      .validate(url)
      .then((validUrl) => {
        utils.form.condition = 'success';
        utils.loading.condition = 'loading';
        return axios.get(createUrl(validUrl), { timeout: 5000 });
      })
      .then((response) => {
        utils.loading.condition = 'loaded';
        const { feed, posts } = parser(response.data.contents);
        const feedId = uniqueId();
        utils.feeds.unshift({ ...feed, id: feedId, url });
        const postsId = posts.map((post) => ({ ...post, id: uniqueId() }));
        utils.posts.unshift(...postsId);
        utils.loading.error = null;
        utils.loading.condition = 'rssAdded';
        if (initialState.feeds.length === 1) {
          addNewPosts(utils);
        }
      })
      .catch((error) => {
        if (error.isAxiosError) {
          utils.loading.error = 'networkError';
          utils.loading.condition = 'failed';
        } else {
          utils.form.error = error.isParsingError ? 'invalidRss' : error.message;
          utils.form.condition = 'failed';
        }
      });
  });
  elements.posts.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    utils.uiState.modalId = id;
    utils.uiState.viewed.add(id);
  });
};
