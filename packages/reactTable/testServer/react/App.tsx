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
                    startWidth: 100
                },
                {
                    header: () => "Body",
                    body: (row) => row.body,
                    startWidth: 200
                },
            ]}
            headerHeight={32}
            rowHeight={80}
            data={props.store.posts}
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