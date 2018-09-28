export interface IStoreState {
  bricks: IBrick[];
  brickCount: number;
  history?: any;
  user?: ICredential;
  networkStatus?: any;
  hash?: string;
  loggedIn?: boolean;
  loggingIn?: boolean;
  account?: string;
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
  expired?: Date | number;
  winner?: IBuilder;
  isPaysToken?: boolean;
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

export interface IActionState {
  id: any;
  process: ActionState;
}

export interface IBrickState {
  [key: string]: any;
  brick?: IBrick;
}

export enum ActionState {
  StartWork,
  Accept,
  Cancel,
}

export enum RoleType {
  Owner,
  Builder,
}
