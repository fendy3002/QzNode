let mobx = require('mobx');
const sa = require('superagent');
let { observable, toJS } = mobx;
import urlRouter from '@fendy3002/url-router';
import listStore from './list';

class Store {
    constructor(context) {
        this.context = context;
        [
            "onPathChange"
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
        this.urlRouter = urlRouter({
            routes: [
                {
                    label: 'list',
                    path: '/',
                    data: null,
                    callback: this.onPathChange
                },
                {
                    label: 'create',
                    path: '/:id/create',
                    data: null,
                    callback: this.onPathChange
                },
                {
                    label: 'view',
                    path: '/:id/view',
                    data: null,
                    callback: this.onPathChange
                },
                {
                    label: 'edit',
                    path: '/:id/edit',
                    data: null,
                    callback: this.onPathChange
                },
                {
                    label: 'delete',
                    path: '/:id/delete',
                    data: null,
                    callback: this.onPathChange
                },
            ],
            option: {
                root: "/" + ((context && context.root) || "admin"),
                event: {
                    historyChange: (data) => {
                    }
                }
            }
        });
        this.urlRouter.refresh();
    }

    context = null;
    urlRouter = null;
    @observable
    currentStore = null;
    storeMap = {
        "delete": (pathData) => null,
        "edit": (pathData) => null,
        "create": (pathData) => null,
        "list": (pathData) => new listStore(this, pathData),
        "view": (pathData) => null
    };

    lastRoute = null;
    onPathChange(data) {
        if ((this.lastRoute && this.lastRoute.label) == data.route.label) {
        }
        else {
            this.currentStore = this.storeMap[data.route.label](data);
        }
        if (this.currentStore.onPathChange) {
            this.currentStore.onPathChange(data);
        }
        this.lastRoute = data.route;
    }
};
export default Store;