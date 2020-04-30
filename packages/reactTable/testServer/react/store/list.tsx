let mobx = require('mobx');
const sa = require('superagent');
let { observable, toJS } = mobx;

class ListStore {
    constructor(mainStore, pathData) {
        [
            "handleExtend",
            "handleTableChange",
            "handleFilterInputChange",
            "handleFilterInputApply",
            "handleFilterInputCancel"
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
    userInit = false;
    users = {};
    @observable
    posts = [];
    @observable
    commentByPostId = {}
    @observable
    filter = {
        page: 1,
        rowCount: 0,
        limit: 25,
        filter: {},
        sort: {}
    };
    @observable
    filterInput = {
        user: ""
    };
    onPathChange(pathData) {
        let filter: any = {
            ...this.filter,
            page: pathData.queryParam.page * 1 || 1,
            limit: pathData.queryParam.limit * 1 || 25,
        };
        for (let query of Object.keys(pathData.queryParam)) {
            let value = pathData.queryParam[query];
            if (query.startsWith("sort.")) {
                let index = query.split(".")[1];
                filter.sort[index] = value;
            }
            if (query.startsWith("filter.")) {
                filter.filter[query.replace("filter.", "")] = value;
            }
        }
        this.filterInput = {
            ...this.filterInput,
            ...this.filter.filter
        };

        let before = Promise.resolve();
        if (!this.userInit) {
            before = sa.get(this.apiPath.getUser)
                .query({
                    "page": 1,
                    "limit": 99999
                }).then((response) => {
                    for (let user of response.body) {
                        this.users[user.id] = user;
                    }
                });
        }

        before.then(() => {
            return sa.get(this.apiPath.getPost + window.location.search).then((response) => {
                this.posts = response.body;
                this.filter = {
                    ...filter,
                    rowCount: response.header['x-total-count']
                }
            });
        })
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
    handleTableChange(args) {
        let newFilter = {
            ...this.filter,
            ...args
        };
        let newQueryParams: any = {
            page: newFilter.page,
            limit: newFilter.limit,
        };
        for (let sortIndex of Object.keys(newFilter.sort)) {
            newQueryParams["sort." + sortIndex] = newFilter.sort[sortIndex];
        }
        this.mainStore.urlRouter.changeQueryParam(newQueryParams);
    }
    handleFilterInputChange(evt) {
        let target = evt.currentTarget;
        this.filterInput = {
            ...this.filterInput,
            [target.name]: target.value
        };
    }
    handleFilterInputApply(evt) {
        let newQueryParams: any = {
        };
        let prefix = "filter.";
        for (let key of Object.keys(this.filterInput)) {
            newQueryParams[prefix + key] = this.filterInput[key];
        }
        this.mainStore.urlRouter.changeQueryParam(newQueryParams);
    }
    handleFilterInputCancel(evt) {
        this.filterInput = {
            ...this.filterInput,
            ...this.filter.filter
        };
    }
};
export default ListStore;