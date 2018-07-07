import * as React from "react";
import config from "../../config";
import { IBrick } from "../../types";
import Brick from "./_shared/Brick";
import "./style.css";

export interface IProps {
  brickCount: number;
  bricks?: IBrick[];
  getBricks?: () => void;
  startWork?: (brickId: number) => Promise<any>;
  acceptWork?: (brickId: number, winner: string) => Promise<any>;
}

export default class Bricks extends React.Component<IProps, object> {
  public state = {
    hash: (this.props as any).match.params.hash
  };

  constructor(props: IProps) {
    super(props);

    this.dismiss = this.dismiss.bind(this);
  }

  public componentWillMount() {
    this.props.getBricks!();
  }

  public render() {
    const { brickCount, bricks } = this.props;

    if (brickCount <= 0) {
      return this.renderNothing();
    }

    return (
      <div className="columns bricks">
        <div className="column">
          {this.state.hash && this.renderNotification(this.state.hash!)}

          {bricks &&
            bricks.length &&
            bricks.map(brick => (
              <Brick
                brick={brick}
                // tslint:disable-next-line:jsx-no-lambda
                startWork={id => this.props.startWork!(id)}
                // tslint:disable-next-line:jsx-no-lambda
                acceptWork={(id, winner) => this.props.acceptWork!(id, winner)}
              />
            ))}
        </div>
      </div>
    );
  }

  private renderNotification(hash: string) {
    return (
      <article className="message is-info">
        <div className="message-header">
          <p>
            Your brick is being added to the network, click&nbsp;
            <a target="_blank" className="is-link" href={this.getTxLink(hash)}>
              here
            </a>&nbsp; for more info.
          </p>
          <button
            className="delete"
            aria-label="delete"
            onClick={this.dismiss}
          />
        </div>
      </article>
    );
  }

  private getTxLink(hash: string): string | undefined {
    return "https://" + config.networkName + ".etherscan.io/tx/" + hash;
  }

  private renderNothing() {
    return (
      <p className="greeting">
        No bricks has been added yet or it's being loaded.
      </p>
    );
  }

  private dismiss() {
    this.setState({ hash: null });
    (this.props as any).history.push("/");
  }
}
