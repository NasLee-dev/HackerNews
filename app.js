const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
ajax.open('GET', NEWS_URL, false);
ajax.send();

let newsFeed = JSON.parse(ajax.responseText);

// document.getElementById('root').innerHTML = `
//   <ul>
//     ${newsFeed.map((news, index) => `<li key=${index}>${news.title} (${news.url})</li>`).join('')}
//   </ul>
// `;

const ul = document.createElement('ul');

for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement('li');
  li.innerHTML = newsFeed[i].title;
  ul.appendChild(li);
}

document.getElementById('root').appendChild(ul);