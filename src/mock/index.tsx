import { BrikStatus, IBrick, IBuilder } from "../types";

const owner: IBuilder = {
	nickName: 'Jerome Chen',
	walletAddress: '0x0',
}

export const Bricks: IBrick[] = [
	{
		description: 'We are offering a bounty for finding bugs in this bounty smart contract. Please post your findings in the Github Issue along with you ETH address.',
		owner,
		status: BrikStatus.Open,
		title: 'Smart Contract Audit Bug Bounty',
		url: 'https://github.com/blockgeeks/BountyAnyERC20/issues/1',
		value: 0.118,
	},
	{
		description: 'We are trying to create a platform that developers can stake ETH to audit a smart contract and then be rewarded for their work. The issue is how to setup the staking without creating incentives to simply approve the contracts as bug-free. Please reply in our community by clicking "View Bounty"',
		owner,
		status: BrikStatus.Open,
		title: 'Propose Incentive Wise Methods for Developers to Stake ETH',
		url: 'https://talk.bountyone.io/t/revolutionizing-the-smart-contract-auditing-industry/77',
		value: 0.118,
	},
	{
		description: 'As a student progress through an online course by watching videos, doing coding projects and completing quizzes, record these events on the blockchain. Once they have reached certain milestone reward them with a token that represent their proof of knowledge.',
		owner,
		status: BrikStatus.Open,
		title: 'Design a smart contract that award students proof of knowledge token',
		url: 'https://talk.bountyone.io/t/ideas-to-turn-a-piece-of-music-into-a-non-fungible/62/3',
		value: 0.278,
	},
	{
		description: 'We would like to hear ideas and proposals on how you would turn a song or piece of music into a non-fungible so that you can be assured that it is the only non-recorded copy.',
		owner,
		status: BrikStatus.Closed,
		title: 'Ideas To Turn A Piece Of Music Into A Non-fungible',
		url: 'https://github.com/BountyOneBounties/Issues/issues/10',
		value: 0.278,
	},
	{
		description: 'We have an audit research client that is interested in the awareness of bugs that remain in live contracts. This is not only referring to Ethereum contracts but rather any platform. This bounty is for whoever posts the most live bugs and contracts that they are in.',
		owner,
		status: BrikStatus.Open,
		title: 'Known Bugs in Live Smart Contracts',
		url: 'https://github.com/BountyOneBounties/Issues/issues/9',
		value: 0.278,
	},
];
