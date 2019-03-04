import * as libRender from "./lib/render";

export = {
    filter: {
        bool: require('./filter/bool'),
        currency: require('./filter/currency'),
        date: require('./filter/date'),
        datetime: require('./filter/datetime'),
        hasVal: require('./filter/hasVal'),
        json: require('./filter/json'),
        pagination: require('./filter/pagination'),
        queryString: require('./filter/queryString')
    },
    global: {
        render: require('./global/render'),
        make: require('./global/make')
    },
    lib: {
        render: libRender
    }
}