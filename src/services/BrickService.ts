import * as _ from "lodash";
import Config from "../config";
import Promisify from "../helpers/Promisify";
import { IBrick, IBuilder } from "../types";
import rpcService from "./RpcService";

export const toBrick = (arr: any[]): IBrick => {
  const brick = {
    builders: (arr as any).builders,
    dateCompleted: arr[6].toNumber(),
    dateCreated: arr[5].toNumber(),
    description: arr[2],
    id: (arr as any).id.toNumber(),
    numOfBuilders: arr[7].toNumber(),
    owner: rpcService.rpc.toHex(arr[3]),
    status: arr[8].toNumber(),
    title: arr[0],
    url: arr[1],
    value: rpcService.rpc.fromWei(arr[4].toString(), "ether"),
    winner: null // arr[9] // It's already hex
  } as IBrick;

  if (arr[9]) {
    const winner = brick.builders.find((b: IBuilder) => arr[9].includes(b.walletAddress));
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
}

export const getBricks = async (start: number, length: number) => {
  const contract = rpcService.contract(
    Config.CONTRACT_ABI,
    Config.CONTRACT_ADDRESS
  );
  let ids: any[] = await Promisify<number[]>((cb: any) =>
    contract.getBrickIds(start, length, cb)
  );
  ids = _(ids)
    .filter(id => id.toNumber() !== 0)
    .drop(start)
    .take(length)
    .value();

  return {
    brickCount: ids.length,
    bricks: (await Promise.all(
      ids.map(async id => {
        const result: any = await Promisify((cb: any) =>
          contract.getBrick(id, cb)
        );
        result.id = id;
        result.builders = await getBrickBuilders(id);

        return result;
      })
    )).map(toBrick)
  };
};

const toBuilders = (items: any) => {
  const len = items[0].length;
  if (!len) {
    return [];
  }

  const builders = [] as IBuilder[];
  for (let i = 0; i < len; i++) {

    // rpcService.rpc.toDecimal(items[2][i].replace(/0*$/, '')).toString();
    // tslint:disable-next-line:no-debugger
    // debugger;

    const keyValue = rpcService.rpc.toAscii(items[2][i]).replace('a', '');

    builders.push({
      dateStarted: items[1][i].toNumber(),
      key: keyValue, // hacked github id
      nickName: rpcService.rpc.toAscii(items[3][i]),
      walletAddress: items[0][i]
    } as IBuilder);
  }

  return builders;
};

export const addBrick = async (brick: IBrick): Promise<number> => {
  if (!rpcService.mainAccount) {
    throw new Error("Metamask required");
  }

  const contract = rpcService.contract(
    Config.CONTRACT_ABI,
    Config.CONTRACT_ADDRESS
  );
  const options = { value: rpcService.rpc.toWei(brick.value, "ether") };
  const newId = (await Promisify((cb: any) => {
    return contract.addBrick(
      brick.title,
      brick.url || "",
      brick.description || "",
      options,
      cb
    );
  })) as number;

  return newId;
};

export const cancel = async (
  brickId: number
): Promise<any> => {
  const contract = rpcService.contract(
    Config.CONTRACT_ABI,
    Config.CONTRACT_ADDRESS
  );
  const options = {};
  const result = await Promisify((cb: any) => {
    return contract.cancel(brickId, options, cb);
  });

  return result;
};

export const startWork = async (
  brickId: number,
  builderId: string,
  builderName: string
): Promise<any> => {
  const contract = rpcService.contract(
    Config.CONTRACT_ABI,
    Config.CONTRACT_ADDRESS
  );
  const options = {};
  const result = await Promisify((cb: any) => {
    const hackedBuilderId = builderId + 'a';
    return contract.startWork(brickId, hackedBuilderId, builderName, options, cb);
  });

  return result;
};

export const getBrickBuilders = async (brickId: number): Promise<any> => {
  const contract = rpcService.contract(
    Config.CONTRACT_ABI,
    Config.CONTRACT_ADDRESS
  );
  const options = {};
  const result = await Promisify((cb: any) => {
    return contract.getBrickBuilders(brickId, options, cb);
  });

  return toBuilders(result);
};

export const acceptWork = async (
  brickId: number,
  winnerWalletAddress: string
): Promise<any> => {
  const contract = rpcService.contract(
    Config.CONTRACT_ABI,
    Config.CONTRACT_ADDRESS
  );
  const options = {};
  const result = await Promisify((cb: any) => {
    return contract.accept(
      brickId,
      [winnerWalletAddress],
      [10000], // all
      options,
      cb
    );
  });

  return result;
};
