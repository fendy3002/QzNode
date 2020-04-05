let MobxReact = require('mobx-react');
let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');
const moment = require('moment');
const lo = require('lodash');

import Table from '../../src/index';
// import validate from './validate'
let { observer, inject } = mobxReact;

let moduleMap = {
    "list": (props: any) => {
        return <Table
            toolbar={({ data }) => {
                return <></>;
            }}
            columns={[
                {
                    header: () => "Title",
                    body: (row) => row.title,
                    startWidth: 700
                },
                {
                    header: () => "Body",
                    body: (row) => row.body,
                    startWidth: 900
                },
            ]}
            headerHeight={32}
            rowHeight={80}
            data={props.store.posts}
            pagination={{
                page: props.store.filter.page,
                pageCount: Math.ceil(props.store.filter.rowCount / props.store.filter.limit),
                limit: props.store.filter.limit,
                onChange: props.store.handlePageChange
            }}
            toolbar={(row) => {
                return <button type="button" className="btn btn-primary">Edit</button>
            }}
        ></Table>;
    }
};

//import 'toastr/build/toastr.css';
@inject("store")
@observer
export default class App extends React.Component {
    constructor(prop) {
        super(prop);
    }
    componentDidMount() {

    }
    render() {
        let store = this.props.store;
        let { currentStore } = store;

        if (!currentStore) {
            return <></>;
        }
        let appModule = moduleMap[currentStore.name]({ store: currentStore });
        return appModule;
    }
};