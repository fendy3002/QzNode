const React = require('react');
const ReactDOM = require('react-dom');
const { ConfirmButton } = require('../../src/ConfirmButton.tsx');
const { EditableLabel } = require('../../src/EditableLabel.tsx');

console.log("A");
ReactDOM.render(
    <div>
        <ConfirmButton>
            
        </ConfirmButton>
    </div>,
    document.getElementById("react-confirm-button")
);

const EditableLabelPage = () => {
    const [myText, setMyText] = React.useState("Editable Label");
    return <div>
        <EditableLabel value={myText} onChange={(newText) => {
            setMyText(newText);
        }}>
            <button>
                <EditableLabel.Value />
            </button>
        </EditableLabel>
    </div>
};
ReactDOM.render(
    <EditableLabelPage />,
    document.getElementById("react-editable-label")
);