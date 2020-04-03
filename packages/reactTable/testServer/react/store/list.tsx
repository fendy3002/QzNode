let mobx = require('mobx');
const sa = require('superagent');
let { observable, toJS } = mobx;

class ListStore {
    constructor(mainStore, pathData) {
        this.mainStore = mainStore;
    }
    name = "list";
    apiPath = {
        "get": "/api/posts"
    };
    mainStore;
    @observable
    posts = [];
    onPathChange(pathData) {
        sa.get(this.apiPath.get).then((response) => {
            this.posts = response.body;
        })
    }
};
export default ListStore;