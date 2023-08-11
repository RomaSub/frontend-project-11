import onChange from 'on-change';

const renderModal = (elements, state) => {
  const { modalTitle, modalDescription, linkRead } = elements.modal;
  const currentPost = state.posts.find((post) => post.id === state.uiState.modalId);
  if (currentPost) {
    modalTitle.textContent = currentPost.title;
    modalDescription.textContent = currentPost.description;
    linkRead.href = currentPost.url;
  } else {
    console.error(`currentPost: ${currentPost}`);
  }
};

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
  const postsSection = document.createElement('div');
  postsSection.classList.add('card', 'border-0');

  const postEl = document.createElement('div');
  postEl.classList.add('card-body');
  const postTitle = document.createElement('h2');
  postTitle.classList.add('card-title', 'h4');
  postTitle.textContent = i18nInstance.t('postHead');
  postEl.appendChild(postTitle);

  postsSection.appendChild(postEl);

  const ulPosts = document.createElement('ul');
  ulPosts.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.posts.forEach((post) => {
    const liPost = document.createElement('li');
    liPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const titlePost = document.createElement('a');
    if (watchedState.uiState.viewed.has(post.id)) {
      titlePost.classList.add('fw-normal', 'link-secondary');
    } else {
      titlePost.classList.add('fw-bold');
    }
    titlePost.setAttribute('href', post.url);
    titlePost.setAttribute('data-id', post.id);
    titlePost.setAttribute('target', '_blank');
    titlePost.setAttribute('rel', 'noopener noreferrer');
    titlePost.textContent = post.title;

    const buttonPost = document.createElement('button');
    buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonPost.setAttribute('type', 'button');
    buttonPost.setAttribute('data-id', post.id);
    buttonPost.setAttribute('data-bs-toggle', 'modal');
    buttonPost.setAttribute('data-bs-target', '#modal');
    buttonPost.textContent = i18nInstance.t('viewButton');

    liPost.appendChild(titlePost);
    liPost.appendChild(buttonPost);

    ulPosts.appendChild(liPost);
  });

  postsSection.appendChild(ulPosts);

  posts.appendChild(postsSection);
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
  const watchedState = onChange(initialState, (path, value) => {
    switch (path) {
      case 'form.condition':
        renderValidation(elements, watchedState, i18nInstance);
        break;
      case 'loading.condition':
        renderFormProcess(elements, watchedState, i18nInstance);
        break;
      case 'posts':
      case 'uiState.viewed':
        renderPosts(elements, watchedState, i18nInstance);
        break;
      case 'feeds':
        renderFeeds(elements, watchedState, i18nInstance);
        break;
      case 'uiState.modalId':
        renderModal(elements, watchedState, value);
        break;
      default:
        throw new Error(`unknow path: ${path}`);
    }
  });
  return watchedState;
};
