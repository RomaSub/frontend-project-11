import onChange from 'on-change';

const renderValidation = (elements, state, i18nInstance) => {
  const { feedback, urlInput } = elements;
  if (state.form.condition === 'failed') {
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    urlInput.classList.add('is-invalid');
    feedback.textContent = i18nInstance.t(`errors.${state.form.error}`);
  }
};

const renderFormProcess = (elements, state, i18nInstance) => {
  const {
    feedback, urlInput, form, button,
  } = elements;
  button.disabled = state.loading.condition === 'loading';
  // urlInput.disabled = state.loading.condition === 'loading';
  if (state.loading.condition === 'failed') {
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    urlInput.classList.remove('is-invalid');
    feedback.textContent = i18nInstance.t(`errors.${state.loading.error}`);
    return;
  }
  if (state.loading.condition === 'rssAdded') {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    urlInput.classList.remove('is-invalid');
    feedback.textContent = i18nInstance.t(state.loading.condition);
    form.reset();
    urlInput.focus();
  }
};

const renderPosts = (elements, watchedState, i18nInstance) => {
  const { posts } = elements;
  posts.innerHTML = '';
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'border-0');

  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInstance.t('postHead');
  cardBodyDiv.appendChild(cardTitle);

  cardDiv.appendChild(cardBodyDiv);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.posts.forEach((post) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const titleEl = document.createElement('a');
    titleEl.classList.add('fw-bold');
    titleEl.setAttribute('href', post.url);
    titleEl.setAttribute('data-id', post.id);
    titleEl.setAttribute('target', '_blank');
    titleEl.setAttribute('rel', 'noopener noreferrer');
    titleEl.textContent = post.title;

    const buttonEl = document.createElement('button');
    buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonEl.setAttribute('type', 'button');
    buttonEl.setAttribute('data-id', post.id);
    buttonEl.setAttribute('data-bs-toggle', 'modal');
    buttonEl.setAttribute('data-bs-target', '#modal');
    buttonEl.textContent = i18nInstance.t('viewButton');

    liEl.appendChild(titleEl);
    liEl.appendChild(buttonEl);

    ulEl.appendChild(liEl);
  });

  cardDiv.appendChild(ulEl);

  posts.appendChild(cardDiv);
};

const renderFeeds = (elements, watchedState, i18nInstance) => {
  const { feeds } = elements;
  feeds.innerHTML = '';
  const feedsSection = document.createElement('div');
  feedsSection.classList.add('card', 'border-0');
  const feedEl = document.createElement('div');
  feedEl.classList.add('card-body');
  feedEl.innerHTML = `<h2 class="card-title h4">${i18nInstance.t('feedHead')}</h2>`;
  feedsSection.append(feedEl);
  const ulFeeds = document.createElement('ul');
  ulFeeds.classList.add('list-group', 'border-0', 'rounded-0');
  feedsSection.append(ulFeeds);
  watchedState.feeds.forEach((feed) => {
    const liFeed = document.createElement('li');
    const titleFeed = document.createElement('h3');
    const descriptionFeed = document.createElement('p');
    liFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
    titleFeed.classList.add('h6', 'm-0');
    titleFeed.textContent = feed.title;
    descriptionFeed.classList.add('m-0', 'small', 'text-black-50');
    descriptionFeed.textContent = feed.description;
    liFeed.append(titleFeed);
    liFeed.append(descriptionFeed);
    ulFeeds.append(liFeed);
  });
  feedsSection.append(ulFeeds);
  feeds.append(feedsSection);
};

export default (elements, initialState, i18nInstance) => {
  const watchedState = onChange(initialState, (path) => {
    switch (path) {
      case 'form.condition':
        renderValidation(elements, watchedState, i18nInstance);
        break;
      case 'loading.condition':
        renderFormProcess(elements, watchedState, i18nInstance);
        break;
      case 'posts':
        renderPosts(elements, watchedState, i18nInstance);
        break;
      case 'feeds':
        renderFeeds(elements, watchedState, i18nInstance);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
