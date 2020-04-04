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
    ${BsTBody} ${BsTr}:nth-of-type(odd){
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