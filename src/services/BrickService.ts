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
    winner: rpcService.rpc.toHex(arr[9])
  } as IBrick;

  // tslint:disable-next-line
  // console.log(brick);
  return brick;
};

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
    builders.push({
      dateStarted: items[1][i].toNumber(),
      key: rpcService.rpc.toDecimal(items[2][i]).toString(),
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

    // tslint:disable-next-line:no-console
    console.log('startWork', builderId, builderName);
    // tslint:disable-next-line:no-debugger
    debugger;
    return contract.startWork(brickId, builderId, builderName, options, cb);
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
