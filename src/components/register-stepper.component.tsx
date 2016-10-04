import * as React from 'react';
import * as Rx from 'rxjs';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import FlatButton from 'material-ui/FlatButton';

import * as HttpModels from '../models/http-models/index';
import * as Services from '../services';
import * as Common from '../common';
import * as Components from './';


export class RegisterStepperComponent extends React.Component<IRegisterStepperComponentProps, IRegisterStepperComponentState> {
    public email: string;
    public password: string;
    public confirmPassword: string;

    private stepIndex: Rx.BehaviorSubject<number>;
    private isRegisterFormValid: Rx.BehaviorSubject<boolean>;
    private userService: Services.UserService;

    private controls: {
        registerForm: Components.RegisterComponent;
        codeValidationForm: Components.CodeValidationComponent;
        stepper: Stepper;
    }

    constructor(props) {
        super(props);

        this.controls = {
            stepper: null,
            registerForm: null,
            codeValidationForm: null
        };

        this.stepIndex = new Rx.BehaviorSubject<number>(0);
    }

    componentWillMount() {
        this.state = {
            valid: false,
            description: '',
            stepLoading: false,
            finished: false,
            content: null
        };

        this.props = {
        };

        this.stepIndex.subscribe(index => this.onStepIndexChange(index));
    }

    componentWillUnmount(): void {
        this.stepIndex.unsubscribe();
        if (this.isRegisterFormValid != null) {
            this.isRegisterFormValid.unsubscribe();
        }
    }

    componentDidMount(): void {
        this.handleNext();
    }

    dummyAsync = (cb) => {
        this.setState({ stepLoading: true }, () => {
            setTimeout(cb, 80);
        });
    }

    handleNext = () => {
        if (!this.state.stepLoading) {
            this.dummyAsync(() => {
                this.removeSubcriptionsByStep(this.stepIndex.value);
                this.stepIndex.next(this.stepIndex.value + 1);
                this.AddSubcriptionsByStep(this.stepIndex.value);
            });
        }
    }

    handlePrev = () => {
        if (!this.state.stepLoading) {
           this.dummyAsync(() => {
                this.removeSubcriptionsByStep(this.stepIndex.value);
                this.stepIndex.next(this.stepIndex.value - 1);
                this.AddSubcriptionsByStep(this.stepIndex.value);
            });
        }
    }

    onStepIndexChange(index: number): void {
        debugger;
        var stepForm = this.renderContent(index);
        this.setState({
            stepLoading: false,
            finished: index >= 2,
            content: stepForm
        });
    }

    onRegistionStepValidate(isValid: boolean): void {
        this.setState({ isValidStep: isValid });

        this.email = this.controls.registerForm.email;
        this.password = this.controls.registerForm.password;
        this.confirmPassword = this.controls.registerForm.confirmPassword;
    }

    removeSubcriptionsByStep(stepIndex: number) {
        if (stepIndex == 1 && this.isRegisterFormValid != null) {
            this.isRegisterFormValid.unsubscribe();
            this.isRegisterFormValid = null;
        }
    }

    AddSubcriptionsByStep(stepIndex: number) {
        if (stepIndex == 1
            && this.isRegisterFormValid == null
            && this.controls.registerForm != null) {
            this.isRegisterFormValid = this.controls.registerForm.isValid;
            this.isRegisterFormValid.subscribe(value => this.onRegistionStepValidate(value));
        }
    }

    checkAvailableNextStep(stepIndex: number): boolean {
        if (stepIndex == 1 && this.controls.registerForm != null) {
            return this.controls.registerForm.validate();
        }

        return false;
    }

    getStepContent(stepIndex: number): JSX.Element{
        switch (stepIndex) {
            case 1:
                return this.renderRegisterForm();
            case 2:
                return this.renderCodeValidationForm();
            case 3:
                return this.renderFinishStep();
            default:
                return null;
        }
    }

    renderContent(stepIndex: number): JSX.Element {
        const {finished} = this.state;
        const contentStyle = { margin: '0 16px', overflow: 'hidden' };

        var canNext: boolean;
        return this.getStepContent(stepIndex);
    }

    private renderRegisterForm(): JSX.Element {
        return <Components.RegisterComponent ref={ref => this.controls.registerForm = ref} />;
    }

    private renderCodeValidationForm(): JSX.Element{
        return <Components.CodeValidationComponent email={this.email} smsNumber={"213123"}/>;
    }

    private renderFinishStep(): JSX.Element {
        return (
            <div>
                <p>Your registration is completed</p>
                <p>You may click following button to access the tutorial</p>
                <FlatButton label="Tutorial" primary={true} />
            </div>
        );
    }

    render() {
        return (
            <Paper className="col-group">
                <Stepper activeStep={this.stepIndex.value} ref={stepper => this.controls.stepper = stepper}>
                    <Step>
                        <StepLabel>Complete your registration form</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirm your validation code</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Finish</StepLabel>
                    </Step>
                </Stepper>
                <div className="container">
                    <ExpandTransition loading={this.state.stepLoading} open={true} >
                        <div style={{display: 'block', verticalAlign: 'middle'}}>
                            {this.state.content}
                        </div>
                        <div style={{ marginTop: 24, marginBottom: 12 }}>
                            <FlatButton
                                label="Back"
                                disabled={this.stepIndex.value === 1}
                                onTouchTap={this.handlePrev}
                                style={{ marginRight: 12 }} />
                            <RaisedButton
                                disabled={this.state.isValidStep === false}
                                label={this.stepIndex.value === 2 ? 'Finish' : 'Next'}
                                primary={true}
                                onTouchTap={this.handleNext} />
                        </div>
                    </ExpandTransition>
                </div>
            </Paper>
        );
    }
}

interface IRegisterStepperComponentProps extends React.Props<RegisterStepperComponent> {
}

interface IRegisterStepperComponentState {
    valid?: boolean;
    description?: string;
    stepLoading?: boolean,
    finished?: boolean,
    isValidStep?: boolean,
    content?: JSX.Element;
}
