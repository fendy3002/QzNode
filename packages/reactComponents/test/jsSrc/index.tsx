const React = require('react');
const ReactDOM = require('react-dom');
const { ConfirmButton } = require('../../src/ConfirmButton.tsx');
const { EditableLabel } = require('../../src/EditableLabel.tsx');

ReactDOM.render(
    <div>
        Normal:&nbsp;
        <ConfirmButton onSubmit={() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    alert("Submitted");
                    resolve()
                }, 1000);
            })
        }}>
            <ConfirmButton.Button>
                {onClick => {
                    return <button type="button" onClick={onClick}>Confirm Button</button>
                }}
            </ConfirmButton.Button>
            <ConfirmButton.Confirm>
                {onClick => {
                    return <button type="button" onClick={onClick}>Are you sure?</button>
                }}
            </ConfirmButton.Confirm>
            <ConfirmButton.Loading>
                <button type="button" disabled>Loading...</button>
            </ConfirmButton.Loading>
            <ConfirmButton.Submitted>
                <button type="button" disabled>Submitted</button>
            </ConfirmButton.Submitted>
        </ConfirmButton><br/>

        With Delay:&nbsp;
        <ConfirmButton onSubmit={() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    alert("Submitted");
                    resolve()
                }, 1000);
            })
        }} delay={{time: 2000}} >
            <ConfirmButton.Button>
                {onClick => {
                    return <button type="button" onClick={onClick}>Confirm Button</button>
                }}
            </ConfirmButton.Button>
            <ConfirmButton.Confirm>
                {onClick => {
                    return <button type="button" onClick={onClick}>Are you sure?</button>
                }}
            </ConfirmButton.Confirm>
            <ConfirmButton.Loading>
                <button type="button" disabled>Loading...</button>
            </ConfirmButton.Loading>
            <ConfirmButton.Submitted>
                <button type="button" disabled>Submitted</button>
            </ConfirmButton.Submitted>
        </ConfirmButton><br/>

        With Validation:&nbsp;
        <ConfirmButton onSubmit={() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    alert("Submitted");
                    resolve()
                }, 1000);
            })
        }} onValidate={() => {
            return new Promise((resolve) => {
                    setTimeout(() => {
                    resolve()
                }, 1000);
            })
        }} >
            <ConfirmButton.Button>
                {onClick => {
                    return <button type="button" onClick={onClick}>On Validate Success</button>
                }}
            </ConfirmButton.Button>
            <ConfirmButton.Confirm>
                {onClick => {
                    return <button type="button" onClick={onClick}>Are you sure?</button>
                }}
            </ConfirmButton.Confirm>
            <ConfirmButton.Loading>
                <button type="button" disabled>Loading...</button>
            </ConfirmButton.Loading>
            <ConfirmButton.Submitted>
                <button type="button" disabled>Submitted</button>
            </ConfirmButton.Submitted>
        </ConfirmButton> 
        <ConfirmButton onSubmit={() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    alert("Submitted");
                    resolve()
                }, 1000);
            })
        }} onValidate={() => {
            return new Promise((resolve, reject) => {
                    setTimeout(() => {
                    alert("Validate Error!");
                    reject()
                }, 1000);
            })
        }} >
            <ConfirmButton.Button>
                {onClick => {
                    return <button type="button" onClick={onClick}>On Validate Error</button>
                }}
            </ConfirmButton.Button>
            <ConfirmButton.Confirm>
                {onClick => {
                    return <button type="button" onClick={onClick}>Are you sure?</button>
                }}
            </ConfirmButton.Confirm>
            <ConfirmButton.Loading>
                <button type="button" disabled>Loading...</button>
            </ConfirmButton.Loading>
            <ConfirmButton.Submitted>
                <button type="button" disabled>Submitted</button>
            </ConfirmButton.Submitted>
        </ConfirmButton>

    </div>,
    document.getElementById("react-confirm-button")
);

const EditableLabelPage = () => {
    const [myText1, setMyText1] = React.useState("Just Text");
    const [myText2, setMyText2] = React.useState("As link");
    return <div>
        <EditableLabel value={myText1} onChange={(evt) => {
            setMyText1(evt.value);
        }}>
            <EditableLabel.Value />
        </EditableLabel><br/>
        <EditableLabel value={myText2} onChange={(evt) => {
            setMyText2(evt.value);
        }}>
            <a href="javascript:void(0)">
                <EditableLabel.Value />
            </a>
        </EditableLabel>
    </div>;
};
ReactDOM.render(
    <EditableLabelPage />,
    document.getElementById("react-editable-label")
);