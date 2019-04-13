const React = require('react');
const ReactDOM = require('react-dom');
const { ConfirmButton } = require('../../src/ConfirmButton.tsx');
const { EditableLabel } = require('../../src/EditableLabel.tsx');

ReactDOM.render(
    <div>
        <ConfirmButton />
    </div>,
    document.getElementById("react-confirm-button")
);

ReactDOM.render(
    <div>
        <EditableLabel />
    </div>,
    document.getElementById("react-editable-label")
);