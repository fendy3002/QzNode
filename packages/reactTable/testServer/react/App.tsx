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
            bodyHeight={600}
            extensible={(props) => {
                return <div>THIS IS DIV</div>;
            }}
            toolbar={({ data }) => {
                return <></>;
            }}
            columns={[
                {
                    header: () => "Name",
                    sort: () => "name",
                    body: (row) => row.name,
                    startWidth: 300
                },
                {
                    header: () => "Username",
                    sort: () => "username",
                    body: (row) => row.username,
                    startWidth: 300
                },
                {
                    header: () => "Email",
                    sort: () => "email",
                    body: (row) => <a href={"mailto:" + row.email}>{row.email}</a>,
                    startWidth: 300
                },
            ]}
            headerHeight={32}
            rowHeight={80}
            data={props.store.users}
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