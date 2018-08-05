import * as React from "react";
import * as Modal from "react-modal";
import Select from "react-select";
import RpcService from "../../../services/RpcService";
import { BrickStatus, IBrick } from "../../../types";
import "./Brick.css";

export interface IProps {
  brick: IBrick;
  startWork: (brickId: number) => Promise<void>;
  acceptWork: (brickId: number, winner: string) => Promise<void>;
}

export default class Brick extends React.Component<IProps, object> {
  public state = { modalIsOpen: false, winner: "" };

  public constructor(props: IProps) {
    super(props);
    this.startWork = this.startWork.bind(this);
    this.acceptWork = this.acceptWork.bind(this);
    this.startAcceptWork = this.startAcceptWork.bind(this);
  }

  public startWork(e: React.SyntheticEvent<HTMLAnchorElement>) {
    if (!RpcService.hasMainAccount()) {
      e.currentTarget.text = "Metamask needed.";
      return;
    }
    this.props.startWork(this.props.brick.id);
  }

  public startAcceptWork() {
    this.state.modalIsOpen = true;
    this.forceUpdate();
  }

  public acceptWork() {
    this.state.modalIsOpen = false;
    this.props.acceptWork(this.props.brick.id, this.state.winner);
  }

  public renderOperations() {
    const options = this.props.brick.builders!.map(builder => ({
      label: builder.walletAddress, // builder.nickName
      value: builder.walletAddress
    }));
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        contentLabel={"Accept work:" + this.props.brick.title}
        className="Modal"
      >
        <h2>{"Accept work: " + this.props.brick.title}</h2>
        <div className="content">
          <p>
            Please make sure that you are sastified by the work the builder
            submits. By clicking the button "submit", your fund will be
            transfered to your selected builder.
          </p>
          <div className="field">
            <label className="label">Winner</label>
            <div className="control">
              <Select
                name="form-field-name"
                options={options}
                // value={this.props.brick.winner}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(item: any) => {
                  this.state.winner = this.props.brick.winner = item.value;
                }}
              />
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button className="button is-link" onClick={this.acceptWork}>
                Submit
              </button>
            </div>
            <div
              className="control"
              onClick={() => {
                // tslint:disable-next-line:jsx-no-lambda
                this.state.modalIsOpen = false;
                this.forceUpdate();
              }}
            >
              <button className="button is-text">Cancel</button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  public render() {
    const { brick } = this.props;

    if (brick === null) {
      return <i>Brick is empty</i>;
    }

    return (
      <div className="card">
        <div className="card-content">
          <div className="level">
            <div className="level-left">
              <h4 className="title level-item is-5">
                <a
                  href={brick.url}
                  target="_blank"
                  className="is-link is-small"
                >
                  {brick.title}
                </a>
              </h4>
            </div>
            <div className="level-right ethValue">
              <div className="tags has-addons nowrap level-item">
                <span className="tag is-grey">
                  <i className="fab fa-ethereum" />&nbsp;{brick.value} ETH
                </span>
              </div>
            </div>
          </div>
          <div className="level">{brick.description || ""}</div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <div className="tags has-addons nowrap">
                  <span className="tag">STATUS</span>
                  <span className="tag is-info">
                    {BrickStatus[brick.status]}
                  </span>
                </div>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <div className="is-info is-inverted is-small">
                  &nbsp;&nbsp;{brick.numOfBuilders}&nbsp; Builders&nbsp;&nbsp;
                </div>
                {brick.status === BrickStatus.Open &&
                  brick.numOfBuilders! > 0 &&
                  brick.owner === RpcService.mainAccount && (
                    <div>
                      <button
                        className="button is-info is-small"
                        onClick={this.startAcceptWork}
                      >
                        Accept work
                      </button>
                      {this.renderOperations()}
                    </div>
                  )}
              </div>
              <br />
              <div className="level-item">
                {brick.status === BrickStatus.Open &&
                  brick.builders &&
                  (!brick.builders.some(
                    b => b.walletAddress === RpcService.mainAccount
                  ) && (
                    <a
                      className="button is-dark is-small"
                      onClick={this.startWork}
                    >
                      <i className="fas fa-wrench" />&nbsp;&nbsp;Start&nbsp;
                      Work&nbsp;&nbsp;
                    </a>
                  ))}
                {brick.status === BrickStatus.Open &&
                  brick.builders &&
                  (brick.builders.some(
                    b => b.walletAddress === RpcService.mainAccount
                  ) && (
                    <a className="button is-success is-small">
                      <i className="fas fa-globe" />&nbsp;&nbsp;Work&nbsp;Started&nbsp;
                    </a>
                  ))}
                {brick.status !== BrickStatus.Open && (
                  <span className="is-light is-button button is-small disabled">
                    <i className="fas fa-wrench" />&nbsp;&nbsp;Not
                    Available&nbsp;&nbsp;
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-one-quarter">
            <div className="tags has-addons">
              {brick.tags &&
                brick.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
