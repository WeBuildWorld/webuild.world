export interface IStoreState {
  bricks: IBrick[];
  brickCount: number;
  user?: ICredential;
  networkStatus?: any;
}

export interface ICredential {
  githubId?: string;
}

export interface IBrick {
  id?: any;
  url: string;
  title: string;
  description?: string;
  value: number | string;
  owner: IBuilder | string;
  builders?: IBuilder[];
  status: BrikStatus;
  tags?: string[];
  dateCreated?: Date | number;
  dateCompleted?: Date | number;
  winner?: string;
}

export enum BrikStatus {
  Inactive,
  Open,
  Closed
}

export interface IBuilder {
  nickName: string;
  walletAddress: string;
}
