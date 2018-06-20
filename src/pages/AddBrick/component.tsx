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
}

export default class Bricks extends React.Component<IProps, IState> {
  public state = {
    brick: { owner: "", status: 0, title: "", url: "", value: 0.011 }
  };

  public constructor(props: IProps) {
    super(props);

    this.setBrickState = this.setBrickState.bind(this);
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.hash) {
      alert("Brick is being mined.");
      location.href = "/";
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
                className="input"
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
                className="input"
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
                className="textarea"
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
                  className="input"
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
          <button
            className="button is-info"
            onClick={
              // tslint:disable-next-line:jsx-no-lambda
              () => this.addBrick()
            }
          >
            Add Your Brick
          </button>
        </div>
      </div>
    );
  }

  public async componentWillReceiveProps(props: IProps) {
    // tslint:disable-next-line:no-console
    console.log(props);
  }

  private addBrick() {
    this.props.addBrick!(this.state.brick);
  }
}
