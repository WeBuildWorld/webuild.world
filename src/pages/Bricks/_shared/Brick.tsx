import * as React from "react";
import RpcService from "../../../services/RpcService";
import { BrickStatus, IBrick } from "../../../types";

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
