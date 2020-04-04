import { FunctionComponent } from "react";
import * as types from './types';

const React = require('react');
const Toolbar: FunctionComponent<types.Toolbar.Props> = (props) => {

    return <>
        <div>
            {props.data && props.body(props.data)}
        </div>
        <div style={{ float: "right" }}>
            {/* filter goes here */}
        </div>
    </>;
};
export default Toolbar;