export default (elements) => (path, value) => {
  switch (path) {
    case 'listOfUrls':
      elements.urlInput.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = 'RSS успешно загружен'; // eslint-disable-line
      break;
    case 'form.url':
      elements.urlInput.value = value; // eslint-disable-line
      break;
    case 'form.errors':
      elements.urlInput.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.textContent = value.message; // eslint-disable-line
      break;
    default:
      throw new Error(`Ошибка путь:${path}: значение:${value}`);
  }
};
