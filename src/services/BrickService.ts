import * as _ from 'lodash';
import Promisify from '../helpers/Promisify';
import { IBrick, IBuilder } from '../types';
import rpcService from './RpcService';

export const toBrick = (obj: any): IBrick => {

  const id = obj.id.toNumber ? obj.id.toNumber() : obj.id;

  const brick = {
    builders: obj.builders,
    dateCompleted: obj.dateCompleted.toNumber(),
    dateCreated: obj.dateCreated.toNumber(),
    description: obj.description,
    expired: obj.expired.toNumber(),
    id,
    numOfBuilders: obj.numOfBuilders.toNumber(),
    owner: rpcService.rpc.toHex(obj.owner),
    status: obj.status.toNumber(),
    tags: obj.tags,
    title: obj.title,
    url: obj.url,
    value: rpcService.rpc.fromWei(obj.value.toString(), 'ether'),
    winner: null,
  } as IBrick;

  if (obj.winners) {
    const winner = brick.builders.find((b: IBuilder) => obj.winners.includes(b.walletAddress));
    brick.winner = winner;
    if (brick.winner && brick.winner.nickName) {
      brick.winner.nickName = trimZeroCode(brick.winner.nickName);
      brick.winner.key = trimZeroCode(brick.winner.key);
    }
  }

  return brick;
};

export const trimZeroCode = (str: string) => {

  while (str.charAt(str.length - 1) === String.fromCharCode(0)) {
    str = str.substring(0, str.length - 1);
  }

  return str;
};

export const getBricksByOwner = async () => {
  const contract = rpcService.contract();

  const address = rpcService.mainAccount;
  if (!address) {
    return {
      brickCount: 0,
      bricks: [],
    };
  }

  let ids: any[] = await Promisify<number[]>((cb: any) =>
    contract.getBrickIdsByOwner(address, cb),
  );

  ids = _(ids)
    .filter((id) => id.toNumber() !== 0)
    .value();

  return {
    brickCount: ids.length,
    bricks: (await Promise.all(
      ids.map(async (id) => {
        return await getBrick(id);
      }),
    )),
  };
};

export const getBricksByBuilder = async () => {
  const contract = rpcService.contract();
  const address = rpcService.mainAccount;
  if (!address) {
    return {
      brickCount: 0,
      bricks: [],
    };
  }

  let ids: any[] = await Promisify<number[]>((cb: any) =>
    contract.getBrickIdsByBuilder(address, cb),
  );

  ids = _(ids)
    .filter((id) => id.toNumber() !== 0)
    .value();

  return {
    brickCount: ids.length,
    bricks: (await Promise.all(
      ids.map(async (id) => {
        return await getBrick(id);
      }),
    )),
  };
};

export const getBricks = async (start: number, length: number, tags: string[] = [],
                                status: number = -1, started: number = 0, expired: number = 0) => {
  const contract = rpcService.contract();
  let ids: any[] = await Promisify<number[]>((cb: any) =>
    contract.getBrickIds(start, length, tags, status, started, expired, cb),
  );

  ids = _(ids)
    .filter((id) => id.toNumber() !== 0)
    // .drop(start)
    // .take(length)
    .value();

  return {
    brickCount: ids.length,
    bricks: (await Promise.all(
      ids.map(async (id) => {
        return await getBrick(id);
      }),
    )),
  };
};

const toBuilders = (items: any) => {
  const len = items[0].length;
  if (!len) {
    return [];
  }

  const builders = [] as IBuilder[];
  for (let i = 0; i < len; i++) {
    const githubIdAndUserName = rpcService.rpc.toAscii(items[2][i]);
    builders.push({
      dateStarted: items[1][i].toNumber(),
      key: githubIdAndUserName,
      nickName: rpcService.rpc.toAscii(items[3][i]),
      walletAddress: items[0][i],
    } as IBuilder);
  }

  return builders;
};

export const getBrick = async (id: any): Promise<IBrick> => {

  const contract = rpcService.contract();

  const brickArr: any = await Promisify((cb: any) =>
    contract.getBrick(id, cb),
  );

  const brickDetailArr: any = await Promisify((cb: any) =>
    contract.getBrickDetail(id, cb),
  );

  const result: any = {
    title: brickArr[0],
    url: brickArr[1],
    // tslint:disable-next-line:object-literal-sort-keys
    owner: brickArr[2],
    value: brickArr[3],
    dateCreated: brickArr[4],
    dateCompleted: brickArr[5],
    expired: brickArr[6],
    status: brickArr[7],
    tags: brickDetailArr[0],
    description: brickDetailArr[1],
    numOfBuilders: brickDetailArr[2],
    winners: brickDetailArr[3],
  };
  result.id = id;
  if (result.tags && result.tags.length) {
    result.tags = result.tags.map((tag: any) => rpcService.rpc.toAscii(tag));
  }

  result.builders = await getBrickBuilders(id);
  return toBrick(result);

};

export const addBrick = async (brick: IBrick): Promise<any> => {
  if (!rpcService.mainAccount) {
    throw new Error('Metamask required');
  }

  const contract = rpcService.contract();
  const options = { value: rpcService.rpc.toWei(brick.value, 'ether') };
  const tags: any[] = brick.tags;

  const currentContractAddress = rpcService.getCurrentContractAddress();
  const tokenContractAddress = rpcService.getTokenContractAddress();

  options.value = '0';
  const value = rpcService.rpc.toWei(1, 'ether');
  const tokenContract = rpcService.getTokenContract();

  await Promisify((cb: any) => {
    return tokenContract.approve(currentContractAddress, value, { value: 0 }, cb);
  });

  const hash = (await Promisify((cb: any) => {
    // options.value = '0';
    return contract.addBrick(
      brick.title,
      brick.url || '',
      brick.expired.valueOf() / 1000,
      brick.description || '',
      tags,
      tokenContractAddress,
      value,
      options,
      cb,
    );
  }));

  return hash;
};

export const cancel = async (
  brickId: number,
): Promise<any> => {
  const contract = rpcService.contract();
  const options = {};
  const result = await Promisify((cb: any) => {
    return contract.cancel(brickId, options, cb);
  });

  return result;
};

export const startWork = async (
  brickId: number,
  builderId: string,
  builderName: string,
): Promise<any> => {
  const contract = rpcService.contract();
  const options = {};
  const result = await Promisify((cb: any) => {
    return contract.startWork(brickId, builderId, builderName, options, cb);
  });

  return result;
};

export const getBrickBuilders = async (brickId: number): Promise<any> => {
  const contract = rpcService.contract();
  const options = {};
  const result = await Promisify((cb: any) => {
    return contract.getBrickBuilders(brickId, options, cb);
  });

  return toBuilders(result);
};

export const acceptWork = async (
  brickId: number,
  winnerWalletAddress: string,
): Promise<any> => {
  const contract = rpcService.contract();
  const options = {};
  const result = await Promisify((cb: any) => {
    return contract.accept(
      brickId,
      [winnerWalletAddress],
      [10000], // all
      options,
      cb,
    );
  });

  return result;
};

export function watchEvents(callback: any) {
  const contract = rpcService.contract();
  const events = contract.allEvents();
  events.watch((error: any, result: any) => {
    if (!error && callback) {

      // tslint:disable-next-line:no-console
      console.log('emit event result:', result);
      if (result.args && result.args._brickId) {
        const brickId = result.args._brickId.toNumber();
        callback(brickId);
      }

    }

  });
}
