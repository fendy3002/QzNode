let React = require('react');
let mobxReact = require('mobx-react');
let { observer, inject } = mobxReact;

import Table from '../../src/index';
import ExtendList from './ExtendList';

@observer
export default class List extends React.Component {
    constructor(prop) {
        super(prop);
    }
    render() {
        const props = this.props;
        const store = this.props.store;

        return <Table
            bodyHeight={600}
            extensible={(args) => {
                return <ExtendList store={store} id={args.data.id} />
            }}
            onExtend={store.handleExtend}
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
            headerHeight={48}
            rowHeight={32}
            data={store.users}
            pagination={{
                page: store.filter.page,
                pageCount: Math.ceil(store.filter.rowCount / store.filter.limit),
                limit: store.filter.limit,
                onChange: store.handlePageChange
            }}
            toolbar={(row) => {
                return <button type="button" className="btn btn-primary">Edit</button>
            }}
        ></Table>;
    }
}