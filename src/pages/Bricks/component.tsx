import * as React from "react";
import { IBrick } from "../../types";
import Brick from "./_shared/Brick";
import "./style.css";

export interface IProps {
  brickCount: number;
  bricks?: IBrick[];
  getBricks?: () => void;
  startWork?: (brickId: number) => Promise<any>;
}

export default class Bricks extends React.Component<IProps, object> {
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
          {bricks &&
            bricks.length &&
            bricks.map(brick => (
              <Brick
                brick={brick}
                // tslint:disable-next-line:jsx-no-lambda
                startWork={id => this.props.startWork!(id)}
              />
            ))}
        </div>
      </div>
    );
  }

  private renderNothing() {
    return (
      <p className="greeting">
        Not bricks has been added yet or it's being loaded.
      </p>
    );
  }
}
