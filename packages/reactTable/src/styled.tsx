import styled, { css } from 'styled-components';

export const BsTr = styled.tr`
    display: block;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
    `;
export const BsTd = styled.td`
    padding: .3rem;
    display: table-cell;
    border: 1px solid #dee2e6;
    width: ${props => props.csswidth}px;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
    `;
export const BsTh = styled.th`
    padding: .3rem;
    display: table-cell;
    font-weight: bold;
    border: 1px solid #dee2e6;
    width: ${props => props.csswidth}px;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
    `;
export const BsTHead = styled.tbody`
    display: table-row-group;
    vertical-align: middle;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
    `;
export const BsTBody = styled.tbody`
    display: table-row-group;
    vertical-align: middle;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
    `;
export const BsTable = styled.table`
    display: table;
    border-spacing: 2px;
    border: 1px solid #dee2e6;
    width: 100%;
    color: #212529;
    border-collapse: collapse;
    margin-bottom: 0px;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: left;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
    & ${BsTBody} ${BsTr}:nth-of-type(odd){
        background-color: rgba(0,0,0,.05);
    }
    `;
export const ResizePanel = styled.div`
    display: inline-block;
    &:hover {
        background-color: #DDDDDD;
    }
    ${props => (props.direction == "horizontal") && css`
        vertical-align: top;
        cursor: ew-resize;
        width: 8px;
        min-height: ${props.height}px;
    `}
    ${props => (props.direction == "vertical") && css`
        vertical-align: top;
        cursor: ns-resize;
        width: ${props.width}px;
        min-height: 8px;
    `}
    ${props => (props.direction == "both") && css`
        vertical-align: top;
        cursor: nwse-resize;
        width: 8px;
        min-height: 8px;
    `}
    `;
export const PaginationLink = styled.a`
    position: relative;
    display: block;
    padding: .5rem .75rem;
    margin-left: -1px;
    line-height: 1.25;
    /*color: #007bff;*/
    color: #000000;
    cursor: pointer;
    text-decoration: none;

    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: left;

    &:hover {
        z-index: 2;
        background-color: #e9ecef;
        border-color: #dee2e6;
    }
    &:not([href]){
        /*color: #007bff;*/
        color: #000000;
    }

    background-color: #fff;
    border: 1px solid #dee2e6;
`;
export const PaginationItem = styled.li`
    display: list-item;
    text-align: -webkit-match-parent;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }

    ${props => (props.active == true) && css`
        & ${PaginationLink} {
            z-index: 3;
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        & ${PaginationLink}:hover {
            color: #fff;
        }
        `
    }

    &:first-child ${PaginationLink} {
        margin-left: 0;

    }
`;
export const PaginationUl = styled.ul`
    display: flex;
    padding-left: 0;
    list-style: none;
    border-radius: .25rem;
    margin-top: 0;
    margin-bottom: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
    -webkit-box-pack: end!important;
    -ms-flex-pack: end!important;
    justify-content: flex-end!important;

    & ${PaginationLink} {
        padding: .25rem .5rem;
        font-size: .875rem;
        line-height: 1.5;
    }

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
`;