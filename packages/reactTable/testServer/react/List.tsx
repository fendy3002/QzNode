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
                    header: () => "Title",
                    sort: () => "title",
                    body: (row) => row.title,
                    startWidth: 300
                },
                {
                    header: () => "Body",
                    sort: () => "body",
                    body: (row) => row.body,
                    startWidth: 600
                },
            ]}
            headerHeight={48}
            rowHeight={80}
            data={store.posts}
            pagination={{
                page: store.filter.page,
                pageCount: Math.ceil(store.filter.rowCount / store.filter.limit),
                limit: store.filter.limit,
                onChange: store.handlePageChange
            }}
            sort={store.filter.sort}
            toolbar={(row) => {
                return <button type="button" className="btn btn-primary">Edit</button>
            }}
            onChange={store.handleTableChange}
        ></Table>;
    }
}