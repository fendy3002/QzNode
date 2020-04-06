let mobx = require('mobx');
const sa = require('superagent');
let { observable, toJS } = mobx;

class ListStore {
    constructor(mainStore, pathData) {
        [
            "handlePageChange",
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
        this.mainStore = mainStore;
    }
    name = "list";
    apiPath = {
        "get": "/api/posts"
    };
    mainStore;
    @observable
    posts = [];
    @observable
    filter = {
        page: 1,
        rowCount: 0,
        limit: 25,
        filter: {}
    }
    onPathChange(pathData) {
        sa.get(this.apiPath.get).then((response) => {
            this.posts = response.body;
            this.filter = {
                ...this.filter,
                rowCount: response.header['x-total-count']
            }
        })
    }
    handlePageChange(evt) {
        this.filter = {
            ...this.filter,
            page: evt.value
        };
    }
};
export default ListStore;