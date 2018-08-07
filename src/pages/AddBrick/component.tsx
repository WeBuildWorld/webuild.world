import * as React from "react";
import { IBrick } from "../../types";
// import { IBrick } from '../../types';
import "./style.css";

export interface IProps {
  addBrick?: (brick: IBrick) => void;
  hash?: string;
}

interface IState {
  brick: IBrick;
  validations: IValidationStatus;
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

  public render() {
    return (
      <div className="columns add-brick">
        <div className="column">
          <div className="field">
            <label className="label">GitHub Issue Link</label>
            <div className="control has-icons-left">
              <input
                className={this.getClassName(this.state.validations.url)}
                type="text"
                name="url"
                placeholder="GitHub Link"
                onChange={this.setBrickState}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-link" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label level">Title</label>
            <div className="control has-icons-left">
              <input
                className={this.getClassName(this.state.validations.title)}
                type="text"
                placeholder="Title"
                name="title"
                onChange={this.setBrickState}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-user" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label level">Description</label>
            <div className="control has-icons-left">
              <textarea
                className={this.getClassName(
                  this.state.validations.description,
                  "textarea"
                )}
                name="description"
                placeholder="Brief Description"
                onChange={this.setBrickState}
              />
            </div>
          </div>
          <div className="level">
            <div className="field">
              <label className="label">ETH Value</label>
              <div className="control has-icons-left">
                <input
                  className={this.getClassName(this.state.validations.value)}
                  type="text"
                  placeholder="ETH"
                  name="value"
                  onChange={this.setBrickState}
                />
                <span className="icon is-small is-left">
                  <i className="fab fa-ethereum" />
                </span>
              </div>
            </div>
          </div>
          <button className="button is-dark" onClick={this.addBrick}>
            Add Your Brick
          </button>
        </div>
      </div>
    );
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
