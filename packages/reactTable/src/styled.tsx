import styled, { css } from 'styled-components';

/* BS table */
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

    // & ${BsTBody} ${BsTr}:nth-of-type(odd){
    //     background-color: rgba(0,0,0,.05);
    // }
    & ${BsTBody} ${BsTr}:hover{
        background-color: rgba(0,0,0,.075)
    }

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
    `;
/* End BS table */

export const BsSelect = styled.select`
    height: calc(1.5em + .5rem + 2px);

    font-weight: 400;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: 0;
    word-wrap: normal;
    text-transform: none;
    margin: 0;
    font-family: inherit;

    overflow: visible;

    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    letter-spacing: normal;
    word-spacing: normal;
    text-indent: 0px;
    text-shadow: none;
    text-align: start;
    -webkit-appearance: menulist;
    align-items: center;
    white-space: pre;
    -webkit-rtl-ordering: logical;
    cursor: default;
    font: 400 13.3333px Arial;

    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;

    width: auto;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
`;
export const BsButtonSecondary = styled.button`
    cursor: pointer;
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    color: #6c757d;
    border-color: #6c757d;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    -webkit-appearance: button;
    text-transform: none;
    overflow: visible;
    margin: 0;
    font-family: inherit;

    color: #6c757d;
    border-color: #6c757d;

    &:hover {
        color: #fff;
        background-color: #6c757d;
        border-color: #6c757d;
    }

    ${props => props.btntype == "success" && css`
        background-color: #1e7e34;
        border-color: #1c7430;
        color: #ffffff;
        &:hover {
            background-color: #218838;
            border-color: #1e7e34;
        }
    `}
    
    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
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
    min-width: 16px;

    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;

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

/* Ninja Panel */

export const DivNinjaPanel = styled.div`
    display: none;
    float: right;
    position: absolute;
    //right: 16px;
    background-color: #FFFFFF;
    padding: 0px 0 4px 0;

    ${props => props.extend == "left" && css`
        padding-left: 32px;
        background: linear-gradient(to right, rgba(255,255,255, 0) 0%, rgba(255,255,255, 1) 10%);
    `}
`;

export const TrNinjaContainer = styled(BsTr)`
    min-height: 32px;
    line-height: 32px;
    // &:hover ${DivNinjaPanel} {
    //     display: inline-block;
    // }
`;
/* end Ninja Panel */

export const DivRow = styled.div`
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
`;
export const DivCol = css`
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;`;
export const DivCol6 = styled.div`
    ${DivCol}
    flex: 0 0 50%;
    max-width: 50%;

    box-sizing: border-box;
    &::after, &::before {
        box-sizing: border-box;
    }
`;