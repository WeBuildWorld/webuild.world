export interface IStoreState {
	Bricks: IBrick[];
	BrickCount: number;
}

export interface IBrick {
	url: string;
	title: string;
	description?: string;
	value: number;
	owner: IBuilder;
	builders?: IBuilder[];
	status: BrikStatus;
	tags: string[];
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
