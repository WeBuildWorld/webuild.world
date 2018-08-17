import { Button, Card, Form, message } from 'antd';
import * as React from "react";

import { IBrick } from "../../types";
import AddBrickForm from './_shared/AddBrickForm';
// import { IBrick } from '../../types';
import "./style.css";

export interface IProps {
  addBrick?: (brick: IBrick) => void;
  form?: any,
  hash?: string;
}

export interface IState {
  brick: IBrick;
  validations: IValidationStatus;
  confirmDirty?: any;
  inputVisible?: false,
}

type UncertainType<T> = T | undefined;

interface IValidationStatus {
  url: UncertainType<boolean>;
  title: UncertainType<boolean>;
  description: UncertainType<boolean>;
  value: UncertainType<boolean>;
}


export default class Bricks extends React.Component<IProps, IState> {
  public state = {
    brick: {
      description: "",
      owner: "",
      status: 0,
      title: "",
      url: "",
      value: 0
    },
    validations: {} as IValidationStatus
  }; // tslint:disable-next-line:object-literal-sort-keys

  public URL_REGEXP = new RegExp(
    "https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}",
    "i"
  );

  public VALIDATION_RULES = {
    url: () => this.URL_REGEXP.test(this.state.brick.url),
    // tslint:disable-next-line:object-literal-sort-keys
    title: () => !!this.state.brick.title,
    description: () => !!this.state.brick.description,
    value: () => !isNaN(this.state.brick.value) && this.state.brick.value > 0.01
  };

  public constructor(props: IProps) {
    super(props);

    this.setBrickState = this.setBrickState.bind(this);
    this.addBrick = this.addBrick.bind(this);
    this.validate = this.validate.bind(this);
    this.formSubmitted = this.formSubmitted.bind(this);
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.hash) {
      const url = "/hash/" + this.props.hash;
      (this.props as any).history.push(url);
    }
  }

  public setBrickState(
    event:
      | React.FormEvent<HTMLInputElement>
      | React.FormEvent<HTMLTextAreaElement>
  ) {
    const field = event.currentTarget.name;
    const value = event.currentTarget.value;
    const currentState = this.state.brick;
    currentState[field] = value;
    this.validate(field);

    return this.setState({ brick: currentState });
  }

  public async formSubmitted(values: any) {
    this.forceUpdate();
    const hide = message.loading('Please check your MetaMask ...', 0);
    try {
      await this.props.addBrick!(values);
      hide();
    } catch (ex) {
      hide();
    }
  }

  public render() {
    return (
      <Card>
        <AddBrickForm onSubmit={this.formSubmitted} />
      </Card>)
  }

  public async componentWillReceiveProps(props: IProps) {
    // tslint:disable-next-line:no-console
    // console.log(props);
  }

  private addBrick() {
    const validated = ["url", "title", "description", "value"].every(
      this.validate
    );
    this.forceUpdate();
    if (validated) {
      this.props.addBrick!(this.state.brick);
    }
  }

  private validate(field: string) {
    this.state.validations[field] = this.VALIDATION_RULES[field]();
    return this.state.validations[field];
  }

  private getClassName(val: UncertainType<boolean>, className = "input") {
    if (val === undefined) {
      return className;
    }

    return className + " " + (val ? " is-success" : " is-danger");
  }
}
