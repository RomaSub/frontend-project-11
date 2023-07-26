import { setLocale, string } from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './render.js';
import resources from './locales/index.js';

export default () => {
  setLocale({
    mixed: {
      notOneOf: 'errors.rssAlredyWas',
    },
    string: {
      url: 'errors.invalidUrl',
    },
  });

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const elements = {
    urlInput: document.querySelector('input'),
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
  };

  const initialState = {
    form: {
      url: '',
      errors: {},
    },
    listOfUrls: [],
  };

  const state = onChange(initialState, render(elements, i18nInstance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.form.url = formData.get('url').trim();
    const schema = string().url().notOneOf(state.listOfUrls);

    schema.validate(state.form.url)
      .then(() => {
        state.listOfUrls.push(state.form.url);
        state.form.url = '';
      })
      .catch((error) => {
        state.form.errors = error;
      })
      .finally(() => {
        elements.urlInput.focus();
      });
  });
};
