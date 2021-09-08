const React = require('react');
const ReactDOM = require('react-dom');
import { ConfirmButton } from '../../src/ConfirmButton';
import { EditableLabel } from '../../src/EditableLabel';
import { Pagination } from '../../src/Pagination';
import { PageLimit } from '../../src/PageLimit';
import { NumericInput } from '../../src/NumericInput';

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
        </ConfirmButton><br />

        With Delay:&nbsp;
        <ConfirmButton onSubmit={() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    alert("Submitted");
                    resolve()
                }, 1000);
            })
        }} delay={{ time: 2000 }} >
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
        </ConfirmButton><br />

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
        </EditableLabel><br />
        <EditableLabel value={myText2} onChange={(evt) => {
            setMyText2(evt.value);
        }}>
            <a href={void (0)}>
                <EditableLabel.Value />
            </a>
        </EditableLabel>
    </div>;
};
ReactDOM.render(
    <EditableLabelPage />,
    document.getElementById("react-editable-label")
);

const PageLimitPage = () => {
    const [myVal1, setMyVal1] = React.useState(7);

    return <div>
        <PageLimit className="form-control" options={[20, 50, 100, 150]} value={myVal1} onChange={(evt) => {
            setMyVal1(evt.value);
        }} />
    </div>;
};
ReactDOM.render(
    <PageLimitPage />,
    document.getElementById("react-page-limit")
);

const PaginationPage = () => {
    const [myVal1, setMyVal1] = React.useState(5);
    const [myVal2, setMyVal2] = React.useState(10);
    const [myVal3, setMyVal3] = React.useState(2);

    return <div>
        <div>
            <Pagination page={myVal3} count={120} limit={20} display={10} onChange={(evt) => {
                setMyVal3(evt.value);
            }} />
        </div>
        <div>
            <Pagination page={myVal1} count={565} limit={20} onChange={(evt) => {
                setMyVal1(evt.value);
            }} />
        </div>
        <div>
            <Pagination page={myVal2} count={565} limit={20} display={10} onChange={(evt) => {
                setMyVal2(evt.value);
            }} />
        </div>
    </div>;
};
ReactDOM.render(
    <PaginationPage />,
    document.getElementById("react-pagination")
);

class NumericInputPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 0
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(evt) {
        const value = evt.currentTarget.value;
        this.setState(() => {
            return {
                number: value
            };
        });
    }
    render() {
        return <>
            <NumericInput value={this.state.number} onChange={this.onChange}/>
            <NumericInput value={this.state.number} readOnly={true} onChange={this.onChange}/>
        </>;
    }
}
ReactDOM.render(
    <NumericInputPage />,
    document.getElementById("react-number-input")
);

