import { FunctionComponent } from "react";

const React = require('react');
const {
    ResizePanel
} = require('./styled');
const { DraggableCore } = require('react-draggable');

interface ResizableDivProps {
    width: number,
    height: number,
    body: any,
    data: {
        [key: string]: any
    },
    onClick?: any,
    onResizeStart: any,
    onResizeDrag: any,
    onResizeStop: any
}

const ResizableDiv: FunctionComponent<ResizableDivProps> = ({
    width, height, body, data,
    onClick,
    onResizeStart, onResizeDrag, onResizeStop }) => {
    let bodyDivStyle: any = {
        verticalAlign: 'top',
        display: "inline-block",
        width: (width - 4) + "px",
        height: height + "px",
    };
    if (onClick) {
        bodyDivStyle.cursor = "pointer";
    }
    return <>
        <div style={{
            display: "block",
            height: height + "px",
            width: (width + 4) + "px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: "0"
        }}>
            <div style={bodyDivStyle}>
                {body}
            </div>
            <DraggableCore
                onStart={onResizeStart}
                onDrag={onResizeDrag}
                onStop={onResizeStop}
            >
                <ResizePanel height={height} direction={"horizontal"}
                    {...data} data-direction="horizontal"></ResizePanel>
            </DraggableCore>
        </div>
        <div style={{
            display: "block",
            height: "8px",
            width: (width + 4) + "px",
            margin: "0"
        }}>
            <DraggableCore
                onStart={onResizeStart}
                onDrag={onResizeDrag}
                onStop={onResizeStop}
            >
                <ResizePanel width={width - 4} direction={"vertical"}
                    {...data} data-direction="vertical"></ResizePanel>
            </DraggableCore>
            <DraggableCore
                onStart={onResizeStart}
                onDrag={onResizeDrag}
                onStop={onResizeStop}
            >
                <ResizePanel direction={"both"}
                    {...data} data-direction="both"></ResizePanel>
            </DraggableCore>
        </div>
    </>;
};

ResizableDiv.defaultProps = {
    data: {}
};

export default ResizableDiv;