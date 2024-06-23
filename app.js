const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

window.addEventListener('hashchange', function() {
  const id = location.hash.substr(1);

  const newsContents = getData(CONTENT_URL.replace('@id', id));

  contaqiner.innerHTML = `
    <h1>${newsContents.title}</h1>
    <div>
      <a href="#">목록으로</a>
    </div>
  `;
});
const newsList = [];
newsList.push('<ul>');

for (let i = 0; i < newsFeed.length; i++) {
  newsList.push(`
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
  `);
}
newsList.push('</ul>');

container.innerHTML = newsList.join('');