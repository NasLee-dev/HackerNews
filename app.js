"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
var CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
var store = {
    currentPage: 1,
    feeds: [],
};
var Api = /** @class */ (function () {
    function Api(url) {
        this.ajax = new XMLHttpRequest();
        this.url = url;
    }
    Api.prototype.getRequest = function () {
        this.ajax.open('GET', this.url, false);
        this.ajax.send();
        return JSON.parse(this.ajax.response);
    };
    return Api;
}());
var NewsFeedApi = /** @class */ (function (_super) {
    __extends(NewsFeedApi, _super);
    function NewsFeedApi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewsFeedApi.prototype.getData = function () {
        return this.getRequest();
    };
    return NewsFeedApi;
}(Api));
var NewsDetailApi = /** @class */ (function (_super) {
    __extends(NewsDetailApi, _super);
    function NewsDetailApi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewsDetailApi.prototype.getData = function () {
        return this.getRequest();
    };
    return NewsDetailApi;
}(Api));
var View = /** @class */ (function () {
    function View(containerId, template) {
        var containerElement = document.getElementById(containerId);
        if (!containerElement) {
            throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.';
        }
        this.container = containerElement;
        this.template = template;
        this.renderTemplate = template;
        this.htmlList = [];
    }
    View.prototype.updateView = function () {
        this.container.innerHTML = this.renderTemplate;
        this.renderTemplate = this.template;
    };
    View.prototype.addHtml = function (htmlString) {
        this.htmlList.push(htmlString);
    };
    View.prototype.getHtml = function () {
        var snapshot = this.htmlList.join('');
        this.clearHtmlList();
        return snapshot;
    };
    View.prototype.setTemplateData = function (key, value) {
        this.renderTemplate = this.renderTemplate.replace("{{__".concat(key, "__}}"), value);
    };
    View.prototype.clearHtmlList = function () {
        this.htmlList = [];
    };
    return View;
}());
var Router = /** @class */ (function () {
    function Router() {
        window.addEventListener('hashchange', this.route.bind(this));
        this.routeTable = [];
        this.defaultRoute = null;
    }
    Router.prototype.setDefaultPage = function (page) {
        this.defaultRoute = { path: '', page: page };
    };
    Router.prototype.addRoutePath = function (path, page) {
        this.routeTable.push({ path: path, page: page });
    };
    Router.prototype.route = function () {
        var e_1, _a;
        var routePath = location.hash;
        if (routePath === '' && this.defaultRoute) {
            this.defaultRoute.page.render();
        }
        try {
            for (var _b = __values(this.routeTable), _c = _b.next(); !_c.done; _c = _b.next()) {
                var routeInfo = _c.value;
                if (routePath.indexOf(routeInfo.path) >= 0) {
                    routeInfo.page.render();
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return Router;
}());
var NewsFeedView = /** @class */ (function (_super) {
    __extends(NewsFeedView, _super);
    function NewsFeedView(containerId) {
        var _this = this;
        var template = "\n      <div class=\"bg-gray-600 min-h-screen\">\n        <div class=\"bg-white text-xl\">\n          <div class=\"mx-auto px-4\">\n            <div class=\"flex justify-between items-center py-6\">\n              <div class=\"flex justify-start\">\n                <h1 class=\"font-extrabold\">Hacker News</h1>\n              </div>\n              <div class=\"items-center justify-end\">\n                <a href=\"#/page/{{__prev_page__}}\" class=\"text-gray-500\">\n                  Previous\n                </a>\n                <a href=\"#/page/{{__next_page__}}\" class=\"text-gray-500 ml-4\">\n                  Next\n                </a>\n              </div>\n            </div> \n          </div>\n        </div>\n        <div class=\"p-4 text-2xl text-gray-700\">\n          {{__news_feed__}}        \n        </div>\n      </div>\n    ";
        _this = _super.call(this, containerId, template) || this;
        _this.api = new NewsFeedApi(NEWS_URL);
        _this.feeds = store.feeds;
        if (_this.feeds.length === 0) {
            _this.feeds = store.feeds = _this.api.getData();
            _this.makeFeeds();
        }
        return _this;
    }
    NewsFeedView.prototype.render = function () {
        store.currentPage = Number(location.hash.substr(7) || 1);
        for (var i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
            var _a = this.feeds[i], id = _a.id, title = _a.title, comments_count = _a.comments_count, user = _a.user, points = _a.points, time_ago = _a.time_ago, read = _a.read;
            this.addHtml("\n        <div class=\"p-6 ".concat(read ? 'bg-red-500' : 'bg-white', " mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100\">\n          <div class=\"flex\">\n            <div class=\"flex-auto\">\n              <a href=\"#/show/").concat(id, "\">").concat(title, "</a>  \n            </div>\n            <div class=\"text-center text-sm\">\n              <div class=\"w-10 text-white bg-green-300 rounded-lg px-0 py-2\">").concat(comments_count, "</div>\n            </div>\n          </div>\n          <div class=\"flex mt-3\">\n            <div class=\"grid grid-cols-3 text-sm text-gray-500\">\n              <div><i class=\"fas fa-user mr-1\"></i>").concat(user, "</div>\n              <div><i class=\"fas fa-heart mr-1\"></i>").concat(points, "</div>\n              <div><i class=\"far fa-clock mr-1\"></i>").concat(time_ago, "</div>\n            </div>  \n          </div>\n        </div>    \n      "));
        }
        this.setTemplateData('news_feed', this.getHtml());
        this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
        this.setTemplateData('next_page', String(store.currentPage + 1));
        this.updateView();
    };
    NewsFeedView.prototype.makeFeeds = function () {
        for (var i = 0; i < this.feeds.length; i++) {
            this.feeds[i].read = false;
        }
    };
    return NewsFeedView;
}(View));
var NewsDetailView = /** @class */ (function (_super) {
    __extends(NewsDetailView, _super);
    function NewsDetailView(containerId) {
        var template = "\n      <div class=\"bg-gray-600 min-h-screen pb-8\">\n        <div class=\"bg-white text-xl\">\n          <div class=\"mx-auto px-4\">\n            <div class=\"flex justify-between items-center py-6\">\n              <div class=\"flex justify-start\">\n                <h1 class=\"font-extrabold\">Hacker News</h1>\n              </div>\n              <div class=\"items-center justify-end\">\n                <a href=\"#/page/{{__currentPage__}}\" class=\"text-gray-500\">\n                  <i class=\"fa fa-times\"></i>\n                </a>\n              </div>\n            </div>\n          </div>\n        </div>\n  \n        <div class=\"h-full border rounded-xl bg-white m-6 p-4 \">\n          <h2>{{__title__}}</h2>\n          <div class=\"text-gray-400 h-20\">\n            {{__content__}}\n          </div>\n  \n          {{__comments__}}\n  \n        </div>\n      </div>\n    ";
        return _super.call(this, containerId, template) || this;
    }
    NewsDetailView.prototype.render = function () {
        var id = location.hash.substr(7);
        var api = new NewsDetailApi(CONTENT_URL.replace('@id', id));
        var newsDetail = api.getData();
        for (var i = 0; i < store.feeds.length; i++) {
            if (store.feeds[i].id === Number(id)) {
                store.feeds[i].read = true;
                break;
            }
        }
        this.setTemplateData('comments', this.makeComment(newsDetail.comments));
        this.setTemplateData('currentPage', String(store.currentPage));
        this.setTemplateData('title', newsDetail.title);
        this.setTemplateData('content', newsDetail.content);
        this.updateView();
    };
    NewsDetailView.prototype.makeComment = function (comments) {
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i];
            this.addHtml("\n        <div style=\"padding-left: ".concat(comment.level * 40, "px;\" class=\"mt-4\">\n          <div class=\"text-gray-400\">\n            <i class=\"fa fa-sort-up mr-2\"></i>\n            <strong>").concat(comment.user, "</strong> ").concat(comment.time_ago, "\n          </div>\n          <p class=\"text-gray-700\">").concat(comment.content, "</p>\n        </div>      \n      "));
            if (comment.comments.length > 0) {
                this.addHtml(this.makeComment(comment.comments));
            }
        }
        return this.getHtml();
    };
    return NewsDetailView;
}(View));
var router = new Router();
var newsFeedView = new NewsFeedView('root');
var newsDetailView = new NewsDetailView('root');
router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);
router.route();
//# sourceMappingURL=app.js.map