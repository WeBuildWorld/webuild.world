import * as React from "react";
import { IBrick } from "../../types";
// import { IBrick } from '../../types';
import "./style.css";

export interface IProps {
  addBrick?: (brick: IBrick) => void;
  getPageTitle?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

interface IState {
  brick: IBrick;
}

export default class Bricks extends React.Component<IProps, IState> {
  public state = {
    brick: {
      owner: "",
      status: 0,
      title: "",
      url: "",
      value: 0.011
    }
  };

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
                placeholder="GitHub Link"
                onBlur={this.props.getPageTitle}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-link" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label level">Title</label>
            <div className="control has-icons-left">
              <input className="input" type="text" placeholder="Title" />
              <span className="icon is-small is-left">
                <i className="fa fa-user" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label level">Description</label>
            <div className="control has-icons-left">
              <textarea className="textarea" placeholder="Brief Description" />
            </div>
          </div>
          <div className="level">
            <div className="field">
              <label className="label">ETH Value</label>
              <div className="control has-icons-left">
                <input className="input" type="text" placeholder="ETH" />
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
