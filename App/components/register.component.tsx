import * as React from "react";
import * as Rx from "rxjs";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import DatePicker from "material-ui/DatePicker";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";

import * as HttpModels from "../models/http-models";
import * as Models from "../models/models";
import * as Services from "../services";
import * as Common from "../common";

export class RegisterComponent extends React.Component<IRegisterComponentProps, IRegisterComponentState> {
    public isValid: Rx.BehaviorSubject<boolean>;

    public email?: string;
    public password?: string;
    public confirmPassword?: string;
    public lastName?: string;
    public firstName?: string;
    public mobilePhone?: string;
    public birthday?: Date;
    public gender?: Models.gender;

    private userService: Services.UserService;
    private description: Rx.BehaviorSubject<string>;
    
    private controls: {
        fistNameField: TextField,
        lastNameField: TextField,
        emailField: TextField,
        passwordField: TextField,
        confirmPasswordField: TextField,
        mobilePhoneField: TextField,
        birthdayDatePicker: DatePicker,
        genderRadioGroup: RadioButtonGroup
    };

    constructor(props) {
        super(props);

        // this.userService = new Services.UserService();
        this.isValid = new Rx.BehaviorSubject<boolean>(false);
        this.description = new Rx.BehaviorSubject<string>("");

        this.onTextFieldChanged = this.onTextFieldChanged.bind(this);
        this.register = this.register.bind(this);

        this.controls = {
            fistNameField: null,
            lastNameField: null,
            emailField: null,
            passwordField: null,
            confirmPasswordField: null,
            birthdayDatePicker: null,
            genderRadioGroup: null,
            mobilePhoneField: null
        };
    }

    public async register(): Promise<Boolean> {
        if (!this.validate()) {
            return;
        }

        var data: HttpModels.IRegisterModel = {
            username: this.controls.emailField.getValue(),
            email: this.controls.emailField.getValue(),
            password: this.controls.passwordField.getValue(),
            confirmPassword: this.controls.confirmPasswordField.getValue()
        };

        var result: Common.Client.Models.IResponse = await this.userService.register(data);
        if (result.isOk && result.code !== "200") {
            this.description.next(result.value.join("\n"));
            this.isValid.next(false);
        }

        return this.isValid.value;
    }

    public validate(): boolean {
        var isValid: boolean = true;
        var errors: Array<string> = new Array<string>();
        if (!this.email) {
            isValid = false;

            errors.push("Email is required.");
        }

        if (!this.password) {
            isValid = false;

            errors.push("Password is required.");
        }

        if (this.password !== this.confirmPassword) {
            isValid = false;

            errors.push("Confirm password is not matched.");
        }

        this.description.next(errors.join("\n"));
        this.isValid.next(isValid);
        return this.isValid.value;
    }

    private componentWillMount(): void {
        this.state = {
            description: ""
        };

        this.props = {};
    }

    componentDidMount(): void {
        this.description.subscribe(description => this.setState({ description: description }));
    }

    componentWillUnmount(): void {
        this.isValid.unsubscribe();
        this.description.unsubscribe();
    }

    private onTextFieldChanged(data: any): void {
        this.email = this.controls.emailField.getValue();
        this.password = this.controls.passwordField.getValue();
        this.confirmPassword = this.controls.confirmPasswordField.getValue();
        this.lastName = this.controls.lastNameField.getValue();
        this.firstName = this.controls.fistNameField.getValue();
        this.mobilePhone = this.controls.mobilePhoneField.getValue();

        this.validate();
    }

    private onBirthdayChanged = (event: undefined, date: Date) => {
        this.birthday = date;
    }

    private onGenderChanged = (event: undefined, data: any) => {
        this.gender = data;
    }


    render() {
        return (
            <div className="container">
                <div className="col-12">
                    <TextField hintText="Email"
                        fullWidth={true}
                        onChange={this.onTextFieldChanged}
                        ref={input => this.controls.emailField = input} />
                </div>
                <div className="col-6">
                    <TextField hintText="Password"
                        fullWidth={true}
                        type="password"
                        onChange={this.onTextFieldChanged}
                        ref={input => this.controls.passwordField = input} />
                </div>
                <div className="col-6">
                    <TextField hintText="Retype Password"
                        fullWidth={true}
                        type="password"
                        onChange={this.onTextFieldChanged}
                        ref={input => this.controls.confirmPasswordField = input} />
                </div>
                <div className="col-6">
                    <TextField hintText="First name"
                        fullWidth={true}
                        onChange={this.onTextFieldChanged}
                        ref={input => this.controls.fistNameField = input} />
                </div>
                <div className="col-6">
                    <TextField hintText="Last name"
                        fullWidth={true}
                        onChange={this.onTextFieldChanged}
                        ref={input => this.controls.lastNameField = input} />
                </div>
                <div className="col-6">
                    <TextField hintText="Mobile number"
                        fullWidth={true}
                        onChange={this.onTextFieldChanged}
                        ref={input => this.controls.mobilePhoneField = input} />
                </div>
                <div className="col-6">
                    <DatePicker hintText="Birthday"
                        fullWidth={true}
                        ref={input => this.controls.birthdayDatePicker = input}
                        onChange={this.onBirthdayChanged} />
                </div>
                <RadioButtonGroup name="gender" className="col-6"
                    ref={input => this.controls.genderRadioGroup = input}>
                    <RadioButton
                        value="female"
                        label="Female"
                        className="col-2"
                        style={{ width: "normal" }} />
                    <RadioButton
                        value="male"
                        label="Male"
                        className="col-2"
                        style={{ width: "normal" }} />
                </RadioButtonGroup>
                <div className="col-12" style={{ display: "none" }}>
                    <RaisedButton label="Register" primary={true} onClick={this.register} />
                </div>
                <div className="hint">
                    {this.state.description}
                </div>
            </div>
        );
    }
}

interface IRegisterComponentProps extends React.Props<RegisterComponent> {
}

interface IRegisterComponentState {
    description: string;
}
