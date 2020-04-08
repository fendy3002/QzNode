let React = require('react');
let mobxReact = require('mobx-react');
let { observer, inject } = mobxReact;

import ListTable from '../../src/ListTable';

@observer
export default class ExtendList extends React.Component {
    constructor(prop) {
        super(prop);
    }
    render() {
        const props = this.props;
        const store = this.props.store;
        const id = this.props.id;
        if (!store.postByUserid[id]) {
            return <></>;
        }

        return <ListTable
            data={store.postByUserid[id]}
            bodyHeight={300}
            rowHeight={32}
            columns={[
                {
                    header: () => "Title",
                    body: (row) => row.title,
                    startWidth: 300
                },
                {
                    header: () => "Body",
                    body: (row) => row.body,
                    startWidth: 400
                },
            ]}
        ></ListTable>;
    }
}