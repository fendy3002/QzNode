let React = require('react');
let lo = require('lodash');
import {
    PaginationUl,
    PaginationLink,
    PaginationItem,
} from './styled';
import * as types from './types';

class Pagination extends React.Component<types.Pagination.Props, any> {
    constructor(props) {
        super(props);
        this.state = {};
        [
            "handleOnClick"
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    public static defaultProps = {
        display: 5,
        limit: 25
    };

    handleOnClick(evt) {
        let { page, onClick, onChange } = this.props;
        if (onClick) {
            onClick(evt);
        }
        if (onChange) {
            if (page != evt.target.dataset.page) {
                onChange({
                    ...evt,
                    value: parseInt(evt.target.dataset.page)
                });
            }
        }
    }
    render() {
        let { page, limit, display, pageCount } = this.props;

        let subtractor = -Math.floor((display - 1) / 2);
        let minPage = Math.max(page + subtractor, 1);
        let maxPage = Math.min(minPage + display - 1, pageCount);

        let pages = [];
        if (minPage > 1) {
            pages.push({ display: "1", page: 1 });
            pages.push({ display: "&hellip;", page: minPage - 1 });
        }
        for (let i = minPage; i <= maxPage; i++) {
            let active = false;
            if (i == page) { active = true; }
            pages.push({ display: i, page: i, active: active });
        }
        if (maxPage < pageCount) {
            pages.push({ display: "&hellip;", page: maxPage });
            pages.push({ display: pageCount, page: pageCount });
        }
        return <>
            <PaginationUl>
                {pages.map((k, i) => {
                    return <PaginationItem key={i} active={k.active}>
                        <PaginationLink style={{  }} data-page={k.page} onClick={this.handleOnClick}
                            dangerouslySetInnerHTML={{
                                __html: k.display
                            }}
                        ></PaginationLink>
                    </PaginationItem>;
                })}
            </PaginationUl>
        </>;
    }
};

export default Pagination;