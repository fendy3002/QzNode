let mobx = require('mobx');
const sa = require('superagent');
let { observable, toJS } = mobx;

class ListStore {
    constructor(mainStore, pathData) {
        [
            "handleExtend",
            "handlePageChange",
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
        this.mainStore = mainStore;
    }
    name = "list";
    apiPath = {
        "getUser": "/api/users",
        "getPostByUser": "/api/user/{id}/posts",
        "getPost": "/api/posts",
        "getCommentByPost": "/api/post/{id}/comments",
    };
    mainStore;
    @observable
    posts = [];
    @observable
    commentByPostId = {}
    @observable
    filter = {
        page: 1,
        rowCount: 0,
        limit: 25,
        filter: {}
    }
    onPathChange(pathData) {
        sa.get(this.apiPath.getPost).then((response) => {
            this.posts = response.body;
            this.filter = {
                ...this.filter,
                rowCount: response.header['x-total-count']
            }
        });
    }
    handleExtend(arg) {
        let post = arg.data;
        if (!this.commentByPostId[post.id]) {
            return sa.get(this.apiPath.getCommentByPost.replace("{id}", post.id)).then((response) => {
                this.commentByPostId = {
                    ...this.commentByPostId,
                    [post.id]: response.body
                };
            });
        }
        return Promise.resolve();
    }
    handlePageChange(evt) {
        this.filter = {
            ...this.filter,
            page: evt.value
        };
    }
};
export default ListStore;