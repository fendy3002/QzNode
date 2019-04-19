let React = require('react');

export class Pagination extends React.Component<any, any> {
    render() {
        const {page, limit, count, onClick} = this.props;
        const maxPage = Math.ceil(count / limit);
        const minRange = Math.max(page - 2, 1);
        const maxRange = Math.min(page + 2, maxPage);
        let pageItems = [];
        if(page > 1){
            pageItems.push(<li className="page-item" key="prev">
                <a className="page-link" href="" onClick={onClick} data-page={page - 1}> Prev </a>
            </li>
            );
        }

        for(let i = minRange; i <= maxRange; i++){
            const active = i == page ? " active" : "";
            pageItems.push(<li className="page-item" key={i}>
                <a className={"page-link" + active } href="" onClick={onClick} data-page={i}> {i} </a>
            </li>
            );
        }
        
        if(page < maxPage){
            pageItems.push(<li className="page-item" key="next">
                <a className="page-link" href="" onClick={onClick} data-page={page + 1}> Next </a>
            </li>
            );
        }

        return <ul className="pagination">
            {pageItems}
        </ul>;
    }
};