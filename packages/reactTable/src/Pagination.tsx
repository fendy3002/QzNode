let React = require('react');
let lo = require('lodash');
import {
    PaginationUl,
    PaginationLink,
    PaginationItem,
    BsSelect
} from './styled';
import * as types from './types';

class Pagination extends React.Component<types.Pagination.Props, any> {
    constructor(props) {
        super(props);
        this.state = {};
        [
            "handleClick"
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    public static defaultProps = {
        display: 5,
        limit: 25,
        paginationOption: [25, 50, 75, 100]
    };

    handleClick(evt) {
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
        let { page, limit, display, pageCount, paginationOption } = this.props;
        if (!paginationOption.some(k => k == limit)) {
            paginationOption.push(limit);
            paginationOption = lo.sortBy(paginationOption, k => k);
        }

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
            <div style={{ display: "inline-block", verticalAlign: "bottom" }}>
                <PaginationUl>
                    {pages.map((k, i) => {
                        return <PaginationItem key={i} active={k.active}>
                            <PaginationLink data-page={k.page} onClick={this.handleClick}
                                dangerouslySetInnerHTML={{
                                    __html: k.display
                                }}
                            ></PaginationLink>
                        </PaginationItem>;
                    })}
                </PaginationUl>
            </div>
            <div style={{
                display: "inline-block", verticalAlign: "bottom",
                height: "calc(1.5em + .5rem + 2px)",
                "marginLeft": "8px", "marginRight": "8px",
            }}>
                <div style={{
                    display: "inline-block",
                    height: "100%",
                    verticalAlign: "middle",
                    marginRight: "-0.25em"
                }}>&nbsp;</div>
                <span style={{ verticalAlign: "middle", }}>
                    Show
                </span>
            </div>
            <BsSelect style={{ verticalAlign: "bottom" }}>
                {paginationOption.map(k => <option value={k}>{k}</option>)}
            </BsSelect>
        </>;
    }
};

export default Pagination;