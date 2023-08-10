export default (rssContent) => {
  const parser = new DOMParser();
  const rssDocument = parser.parseFromString(rssContent, 'application/xml');
  const parsingErrorNode = rssDocument.querySelector('parsererror');

  if (parsingErrorNode) {
    const parsingError = new Error(parsingErrorNode.textContent);
    parsingError.isParsingError = true;
    throw parsingError;
  }

  const channelTitle = rssDocument.querySelector('channel title').textContent;
  const channelDescription = rssDocument.querySelector('channel description').textContent;

  const postElements = [...rssDocument.querySelectorAll('channel item')];
  const posts = postElements.map((postElement) => {
    const postTitle = postElement.querySelector('title').textContent;
    const postDescription = postElement.querySelector('description').textContent;
    const postLink = postElement.querySelector('link').textContent;
    return { title: postTitle, description: postDescription, url: postLink };
  });

  const channelInfo = { title: channelTitle, description: channelDescription };
  return { feed: channelInfo, posts };
};
