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
	url: string;
	title: string;
	description?: string;
	value: number;
	owner: IBuilder;
	builders?: IBuilder[];
	status: BrikStatus;
	tags?: string[];
}

export enum BrikStatus {
	Inactive,
	Open,
	Closed,
}

export interface IBuilder {
	nickName: string;
	walletAddress: string;
}
