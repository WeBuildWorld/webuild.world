export interface IStoreState {
  bricks: IBrick[];
  brickCount: number;
  user?: ICredential;
  networkStatus?: any;
  hash?: string;
  loggedIn?: boolean;
  loggingIn?: boolean;
}

export interface ICredential {
  githubId?: string;
  avatar_url?: string;
  email?: string;
  name?: string;
  login?: string;
}

export interface IBrick {
  id?: any;
  url: string;
  title: string;
  description?: string;
  value: number | string;
  owner: IBuilder | string;
  numOfBuilders?: number;
  builders?: IBuilder[];
  status: BrickStatus;
  tags?: string[];
  dateCreated?: Date | number;
  dateCompleted?: Date | number;
  winner?: IBuilder;
}

export enum BrickStatus {
  Inactive,
  Open,
  Completed,
  Canceled,
}

export interface IBuilder {
  nickName?: string;
  walletAddress?: string;
  dateStarted?: number;
  key?: string;
}
 