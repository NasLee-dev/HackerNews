const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';


ajax.open('GET', NEWS_URL, false);
ajax.send();

let newsFeed = JSON.parse(ajax.responseText);

// document.getElementById('root').innerHTML = `
//   <ul>
//     ${newsFeed.map((news, index) => `<li key=${index}>${news.title} (${news.url})</li>`).join('')}
//   </ul>
// `;

const ul = document.createElement('ul');

window.addEventListener('hashchange', function() {
  const id = location.hash.substr(1);
  ajax.open('GET', CONTENT_URL.replace('@id', id), false);
  ajax.send();
  const newsContents = JSON.parse(ajax.response);
  const title = this.document.createElement('h1');
  if (content.innerHTML !== '') {
    content.innerHTML = '';
  }
  title.innerHTML = newsContents.title;
  content.appendChild(title);
});

for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `#${newsFeed[i].id}`;
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

  li.appendChild(a);
  ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);