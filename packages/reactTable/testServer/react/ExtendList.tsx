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
        if (!store.commentByPostId[id]) {
            return <></>;
        }

        return <ListTable
            data={store.commentByPostId[id]}
            bodyHeight={250}
            rowHeight={32}
            columns={[
                {
                    header: () => "Email",
                    body: (row) => <a href={"mailto:" + row.email}>{row.email}</a>,
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