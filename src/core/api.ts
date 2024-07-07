import { NewsDetail, NewsFeed } from "../types";

export class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  getRequest<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
    this.ajax.open('GET', this.url);
    this.ajax.addEventListener('load', () => {
      cb(JSON.parse(this.ajax.response) as AjaxResponse);
    })
    this.ajax.send();
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(cb: (data: NewsFeed[]) => void): void {
    return this.getRequest<NewsFeed[]>(cb);
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(cb: (data: NewsDetail) => void): void {
    return this.getRequest<NewsDetail>(cb);
  }
}
