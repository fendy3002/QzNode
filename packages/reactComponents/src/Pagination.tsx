import * as React from 'react';
import * as PropTypes from 'prop-types';

export class Pagination extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    handleOnClick(evt){
        let {page, onClick, onChange} = this.props;
        if(onClick){
            onClick(evt);
        }
        if(onChange){
            if(page != evt.target.dataset.page){
                onChange({
                    ...evt,
                    value: parseInt(evt.target.dataset.page)
                });
            }
        }
    }
    render() {
        let {page, limit, display, count} = this.props;

        const maxPage = Math.ceil(count / limit);
        let minRange = Math.max(page - Math.floor(display / 2), 1);
        let maxRange = Math.min(minRange + display - 1, maxPage);
        if((maxRange - minRange + 1) < display){
            minRange = Math.max(maxRange - display + 1, 1);
        }
        let pageItems = [];

        if(minRange > 1){
            pageItems.push(<li className="page-item" key="first">
                <a className="page-link" href="javascript:void(0)" onClick={this.handleOnClick} data-page={1}> &lt;&lt; </a>
            </li>
            );
        }
        if(page > 1){
            pageItems.push(<li className="page-item" key="prev">
                <a className="page-link" href="javascript:void(0)" onClick={this.handleOnClick} data-page={page - 1}> &lt; </a>
            </li>
            );
        }

        for(let i = minRange; i <= maxRange; i++){
            const active = i == page ? " active" : "";
            pageItems.push(<li className={"page-item" + active } key={i}>
                <a className={"page-link"} href="javascript:void(0)" onClick={this.handleOnClick} data-page={i}> {i} </a>
            </li>
            );
        }
        
        if(page < maxPage){
            pageItems.push(<li className="page-item" key="next">
                <a className="page-link" href="javascript:void(0)" onClick={this.handleOnClick} data-page={page + 1}> &gt; </a>
            </li>
            );
        }
        if(maxRange < maxPage){
            pageItems.push(<li className="page-item" key="last">
                <a className="page-link" href="javascript:void(0)" onClick={this.handleOnClick} data-page={maxPage}> &gt;&gt; </a>
            </li>
            );
        }

        return <ul className="pagination">
            {pageItems}
        </ul>;
    }
};
Pagination.propTypes = {
    limit: PropTypes.number,
    page: PropTypes.number.isRequired,
    display: PropTypes.number,

};
Pagination.defaultProps = {
    display: 5,
    limit: 20
};