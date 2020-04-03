const React = require('react');
const lo = require('lodash');

interface State {
    editing: boolean,
    text: string
}
interface TableColumn {
    Header: () => any,
    Body: (row) => any,
    StartWidth: 60,

}
interface TableProps {
    data: any[],
    Columns: TableColumn[]
    RowHeight: number
}

class Table extends React.Component<TableProps, State> {
    constructor(props) {
        super(props);
        this.state = {
            Columns: []
        };
    }

    static getDerivedStateFromProps(props, state) {
        let returnState = {
            ...state
        };
        if (state.Columns.length != props.Columns.length) {
            returnState.Columns = props.Columns.map(k => {
                return {
                    ...k,
                    width: k.StartWidth
                };
            });
        }
        return returnState;
    }

    render() {
        const { data, RowHeight } = this.props;
        const { Columns } = this.state;
        return <table>
            <thead>
                <tr
                    style={{
                        display: "block",
                    }}>
                    {Columns.map((col, index) => {
                        return <th width={col.width} key={"th_" + index}>
                            {col.Header()}
                        </th>
                    })}
                </tr>
            </thead>
            <tbody>
                {(data || []).map((row, rowIndex) => {
                    let rowBody = Columns.map((col, colIndex) => {
                        return <td
                            style={{
                            }}
                            key={"td_" + rowIndex + "_" + colIndex}>
                            <div style={{
                                width: col.width,
                                height: RowHeight + "px",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                {col.Body(row)}
                            </div>
                        </td>;
                    });
                    return <tr
                        style={{
                            display: "block",
                        }}
                        key={"tr_" + rowIndex}>
                        {rowBody}
                    </tr>;
                })}
            </tbody>
        </table>;
    }
};
export default Table;