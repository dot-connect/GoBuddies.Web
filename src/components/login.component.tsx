import * as React from 'react';

import * as HttpModels from '../models/http-models/index';
import * as Services from '../services';
import * as Common from '../common';
import * as CommonClientModels from '../common/client/models';

import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

const style = {
  "white-space": "pre-wrap",
};

export class LoginComponent extends React.Component<ILoginComponentProps, ILoginComponentState> {
    private userService: Services.UserService;

    private controls: {
        emailField: TextField;
        passwordField: TextField;
    }

    constructor(props) {
        super(props);

        this.userService = new Services.UserService();

        this.login = this.login.bind(this);
        this.a = this.a.bind(this);
        
        this.controls = {
            emailField: null,
            passwordField: null
        };
    }

    componentWillMount() {
        this.state = {
            valid: false,
            description: ''
        };
    }

    a() {
        this.login();
    }

    private async login(): Promise<void> {
        if (!this.validate()) {
            return;
        }

        // Common.Client.Services.UiService.ShowMessageBox("Loading...", "haha", CommonClientModels.DialogButtonOptions.Ok | CommonClientModels.DialogButtonOptions.Cancel);
        var data: HttpModels.ILoginModel = {
            email: this.controls.emailField.getValue(),
            password: this.controls.passwordField.getValue(),
        };

        var result: Common.Client.Models.IResponse = await this.userService.login(data);
        if (result.isOk && result.code !== "200") {
            this.setState({
                description: result.value.join("\n"),
                valid: false
            });
        }
    }

    private validate(): boolean {
        this.setState({
            description: null,
            valid: true
        });

        var isValid: boolean = true;
        var errors: Array<string> = new Array<string>();

        if (!this.controls.emailField.getValue()) {
            isValid = false;

            errors.push("Email is required.");
        }

        if (!this.controls.passwordField.getValue()) {
            isValid = false;

            errors.push("Password is required.");
        }
        
        this.setState({
            description: errors.join("\n"),
            valid: isValid
        });


        return isValid;
    }

    render() {
        return (
            <div style={{display: "inline"}}>
                <div className="block-item-div">
                    <div className="block-item-div">
                        <TextField hintText="Email address"
                            ref={input => this.controls.emailField = input}
                            style={{ display: "inherit", width: ""}}/>
                    </div>
                    <div className="block-item-div">
                        <TextField hintText="Password"
                            type="password"
                            ref={input => this.controls.passwordField = input}
                            style={{display: "inherit", width: ""}}/>
                    </div>
                    <div className="block-item-div">
                        <RaisedButton label="Login"
                            primary={true} onClick={this.login}
                            style={{ display: "inherit", width: "" }}/>
                    </div>
                </div>
                <div className="block-item-div"/>
                <div className="block-item-div">
                    <a className="hint" style={{ display: "inherit", width: "" }}>{this.state.description}</a>
                </div>
            </div>
        );
    }
}


interface ILoginComponentProps{
}

interface ILoginComponentState {
    valid: boolean;
    description: string;
}