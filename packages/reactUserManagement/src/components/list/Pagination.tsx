let React = require('react');
let mobx = require('mobx');
let mobxReact = require('mobx-react');
let {observer, inject} = mobxReact;

@inject("store")
@observer
export class Pagination extends React.Component<any, any> {
    render() {
        let store = this.props.store;
        const {page, limit, userCount} = store.listStore;
        console.log(page, limit, userCount);
        const maxPage = Math.ceil(userCount / limit);
        const minRange = Math.max(page - 2, 1);
        const maxRange = Math.min(page + 2, maxPage);
        let pageItems = [];
        if(page > 1){
            pageItems.push(<li className="page-item" key="prev">
                <a className="page-link" href="" data-page={page - 1}> Prev </a>
            </li>
            );
        }

        for(let i = minRange; i <= maxRange; i++){
            const active = i == page ? " active" : "";
            pageItems.push(<li className="page-item" key={i}>
                <a className={"page-link" + active } href="" data-page={i}> {i} </a>
            </li>
            );
        }
        
        if(page < maxPage){
            pageItems.push(<li className="page-item" key="next">
                <a className="page-link" href="" data-page={page + 1}> Next </a>
            </li>
            );
        }

        return <ul className="pagination">
            {pageItems}
        </ul>;
    }
};