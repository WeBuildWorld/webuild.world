export interface IStoreState {
  bricks: IBrick[];
  brickCount: number;
  user?: ICredential;
  networkStatus?: any;
  hash?: string;
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
  status: BrickStatus;
  tags?: string[];
  dateCreated?: Date | number;
  dateCompleted?: Date | number;
  winner?: string;
}

export enum BrickStatus {
  Inactive,
  Open,
  Completed
}

export interface IBuilder {
  nickName: string;
  walletAddress: string;
}
