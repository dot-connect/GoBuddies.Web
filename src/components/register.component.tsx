import * as React from 'react';

import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import * as HttpModels from '../models/http-models/index';
import * as Services from '../services';
import * as Common from '../common';

const style = {
  "white-space": "pre-wrap",
};

export class RegisterComponent extends React.Component<IRegisterComponentProps, IRegisterComponentState> {
    private userService: Services.UserService;

    private controls: {
        fistNameField: TextField,
        lastNameField: TextField,
        emailField: TextField,
        passwordField: TextField,
        confirmPasswordField: TextField
    }

    constructor(props) {
        super(props);
                
        this.userService = new Services.UserService();

        this.onFieldChanged = this.onFieldChanged.bind(this);
        this.register = this.register.bind(this);

        this.controls = {
            fistNameField: null,
            lastNameField: null,
            emailField: null,
            passwordField: null,
            confirmPasswordField: null
        };
    }

    componentWillMount() {
        this.state = {
            valid: false,
            description: ''
        };
    }

    private onFieldChanged(data: any): void {
        this.validate();
    }

    private async register() {
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

        if (this.controls.passwordField.getValue()
            != this.controls.confirmPasswordField.getValue()) {
            isValid = false;

            errors.push("Confirm password is not matched.")
        }

        this.setState({
            description: errors.join("\n"),
            valid: isValid
        });
        
        return isValid;
    }


    
    render() {
        return (
            <Paper zDepth={2}>
                <div>
                    <div>
                        <TextField hintText="Email address"
                            style={style}
                            onChange={this.onFieldChanged}
                            ref={input => this.controls.emailField = input}/>
                    </div>
                    <div>
                        <TextField hintText="Password"
                            style={style}
                            type="password"
                            onChange={this.onFieldChanged}
                            ref={input => this.controls.passwordField = input}/>
                        <TextField hintText="Retype Password"
                            style={style}
                            type="password"
                            onChange={this.onFieldChanged}
                            ref={input => this.controls.confirmPasswordField = input}/>
                    </div>
                    <div>
                        <TextField hintText="First name"
                            style={style}
                            onChange={this.onFieldChanged}
                            ref={input => this.controls.fistNameField = input}/>
                        <TextField hintText="Last name"
                            style={style}
                            onChange={this.onFieldChanged}
                            ref={input => this.controls.lastNameField = input}/>
                    </div>
                    <div>
                        <RaisedButton label="Register" primary={true} onClick={this.register}/>
                    </div>
                    <div style={style}>
                        {this.state.description}
                    </div>
                </div>
            </Paper>
        );
    }
}

interface IRegisterComponentProps{
}

interface IRegisterComponentState {
    valid: boolean;
    description: string;
}
