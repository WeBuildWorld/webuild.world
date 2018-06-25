import * as React from "react";
import RpcService from "../../../services/RpcService";
import { BrikStatus, IBrick } from "../../../types";

export interface IProps {
  brick: IBrick;
  startWork: (brickId: number) => Promise<void>;
}

export default class Brick extends React.Component<IProps, object> {
  public constructor(props: IProps) {
    super(props);
    this.startWork = this.startWork.bind(this);
  }

  public startWork(e: React.SyntheticEvent<HTMLAnchorElement>) {
    if (!RpcService.hasMainAccount()) {
      e.currentTarget.text = "Metamask needed.";
      return;
    }
    this.props.startWork(this.props.brick.id);
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
              <h4 className="title level-item">
                <a
                  href={brick.url}
                  target="_blank"
                  className="is-info is-small"
                >
                  {brick.title}
                </a>
              </h4>
            </div>
            <div className="level-right ethValue">
              <div className="tags has-addons nowrap level-item">
                <span className="tag">
                  <i className="fab fa-ethereum">&nbsp;{brick.value} ETH</i>
                </span>
              </div>
            </div>
          </div>
          <div className="level">{brick.description || ""}</div>
          <div className="level">
            <div className="level-left" />
            <div className="level-right">
              <div className="level-item">
                <div className="has-text-info is-inverted is-small">
                  <i className="fas fa-wrench" />&nbsp;&nbsp;{brick.builders}&nbsp;
                  Builders&nbsp;&nbsp;
                </div>
              </div>
              <br />
              <div className="level-item">
                <a className="button is-info is-small" onClick={this.startWork}>
                  <i className="fas fa-code-branch" />&nbsp;&nbsp;Start&nbsp;
                  Work&nbsp;&nbsp;
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-one-quarter marginLeft">
            <div className="tags has-addons nowrap">
              <span className="tag">STATUS</span>
              <span className="tag is-info">{BrikStatus[brick.status]}</span>
            </div>
          </div>
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
