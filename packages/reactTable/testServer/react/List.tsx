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
        const { filterInput, users, handleFilterInputChange } = store;

        return <Table
            bodyHeight={480}
            extensible={(args) => {
                return <ExtendList store={store} id={args.data.id} />
            }}
            onExtend={store.handleExtend}
            toolbar={({ data }) => {
                return <></>;
            }}
            filterPage={() => {
                return <div className="row">
                    <div className="col-md-6">
                        <div className="row">
                            <label className="col-md-4 col-form-label">
                                User
                            </label>
                            <div className="col-md-8">
                                <select className="form-control" type="text"
                                    name="user" onChange={handleFilterInputChange}
                                    value={filterInput.user}>
                                    <option value="">-- ALL USER -- </option>
                                    {Object.keys(users).map(userId => {
                                        return <option key={userId} value={userId}>{users[userId].username}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>;
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
            }}
            sort={store.filter.sort}
            toolbar={(row) => {
                return <button type="button" className="btn btn-primary">Edit</button>
            }}
            onChange={store.handleTableChange}
        ></Table>;
    }
}