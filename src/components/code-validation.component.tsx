import * as React from "react";
import * as Rx from "rxjs";

import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import ExpandTransition from "material-ui/internal/ExpandTransition";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";

import * as Models from "../models/models";

export class CodeValidationComponent extends React.Component<ICodeValidationComponentProps, ICodeValidationComponentState> {
    private validationMethod: Rx.BehaviorSubject<Models.validationMethod>;

    private controls: {
        validationCodeField: TextField;
    };

    constructor(props) {
        super(props);
    }

    public isValid: Rx.BehaviorSubject<boolean>;

    componentWillMount() {

        this.controls = {
            validationCodeField: null
        };

        this.state = {
            selectedValidationMethod: null,
            isSubmitCodeBntDisable: true,
            validationMethodLoading: false
        };

        this.validationMethod = new Rx.BehaviorSubject<Models.validationMethod>(null);
        this.isValid = new Rx.BehaviorSubject<boolean>(false);
    }

    componentDidMount(): void {
        this.validationMethod.distinctUntilChanged().subscribe(validationMethod => this.onValidationMethodChanged(validationMethod));
    }

    componentWillUnmount(): void {
        this.validationMethod.unsubscribe();
        this.isValid.unsubscribe();
    }

    onValidationMethodChange = (event, index, value): void => {
        this.setState({ selectedValidationMethod: value });
        this.validationMethod.next(value);
    }

    onValidationCodeFieldChange = () => {
        this.setState({ isSubmitCodeBntDisable: this.controls.validationCodeField.getValue() == null || this.controls.validationCodeField.getValue() === "" });
    }

    onRequestNewValidationCodeBntTap = () => {
    }

    onSubmitValidationCodeBntTap = () => {
    }

    private  dummyAsync(func: Function) {
        this.setState({ validationMethodLoading: true }, () => {
            setTimeout(func, 500);
        });
    }

    private renderVlidationMethods(): Array<JSX.Element> {
        var items: Array<JSX.Element> = new Array<JSX.Element>();
        if (this.props.email) {
            items.push(<MenuItem value={"email"} key={1} primaryText={"Email"} />);
        }

        if (this.props.smsNumber) {
            items.push(<MenuItem value={"sms"} key={2} primaryText={"Sms"} />);
        }

        return items;
    }

    private onValidationMethodChanged(validationMethod: Models.validationMethod): void {
        this.dummyAsync(() => this.setState({
            validationMethodLoading: false,
        }));
    }

    private renderValidationMethodContent(validationMethod: Models.validationMethod): JSX.Element {
        if (validationMethod === "email") {
            return (
                <div className="col-group">
                    <div className="col-12" style={{ marginTop: "8px" }}>
                        <a className="col-6">We will send a validation code your email: {this.props.email}</a>
                        <RaisedButton label="Send"
                            onTouchTap={this.onRequestNewValidationCodeBntTap}/>
                    </div>
                    <div className="col-12" style={{ marginTop: "8px" }}>
                        <div className="col-6">
                            <TextField hintText="Enter your validation code"
                                onChange={this.onValidationCodeFieldChange}
                                ref={ref => this.controls.validationCodeField = ref} />
                        </div>
                        <RaisedButton label="OK"
                            disabled={this.state.isSubmitCodeBntDisable}
                            onTouchTap={this.onSubmitValidationCodeBntTap}/>
                    </div>
                </div>
            );
        }

        if (validationMethod === "sms") {
            return (
                <div className="col-group">
                    <div className="col-12" style={{ marginTop: "8px" }}>
                        <a className="col-6">We will send a validation to your mobile phone: {this.props.smsNumber}</a>
                        <RaisedButton label="Send" />
                    </div>
                    <div className="col-12" style={{ marginTop: "8px" }}>
                        <div className="col-6">
                            <TextField hintText="Enter your validation code"
                                onChange={this.onValidationCodeFieldChange}
                                ref={ref => this.controls.validationCodeField = ref} />
                        </div>
                        <RaisedButton label="OK"
                            disabled={this.state.isSubmitCodeBntDisable} />
                    </div>
                </div>
            );
        }

        return null;
    }

    render() {
        return (
            <div className="container">
                <div className="col-12" style={{ marginTop: "8px" }}>
                    <a className="col-6">Choose your validation method</a>
                    <SelectField value={this.state.selectedValidationMethod} onChange={this.onValidationMethodChange}>
                        {this.renderVlidationMethods()}
                    </SelectField>
                </div>

                <div className="col-12" >
                    <ExpandTransition loading={this.state.validationMethodLoading} open={true}>
                        {this.renderValidationMethodContent(this.validationMethod.value)}
                    </ExpandTransition>
                </div>
            </div>
        );
    }
}


interface ICodeValidationComponentProps extends React.Props<CodeValidationComponent> {
    smsNumber?: string;
    email?: string;
}

interface ICodeValidationComponentState {
    selectedValidationMethod?: Models.validationMethod;
    validationMethodLoading?: boolean;
    isSubmitCodeBntDisable?: boolean;
}