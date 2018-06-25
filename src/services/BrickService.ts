import * as _ from "lodash";
import Config from "../config";
import Promisify from "../helpers/Promisify";
import { IBrick } from "../types";
import rpcService from "./RpcService";

export const toBrick = (arr: any[]): IBrick => {
  const brick = {
    builders: arr[7].toNumber(),
    dateCompleted: arr[6].toNumber(),
    dateCreated: arr[5].toNumber(),
    description: arr[2],
    id: (arr as any).id.toNumber(),
    owner: rpcService.rpc.toHex(arr[3]),
    status: arr[8].toNumber(),
    title: arr[0],
    url: arr[1],
    value: rpcService.rpc.fromWei(arr[4].toString(), "ether"),
    winner: rpcService.rpc.toHex(arr[9])
  } as IBrick;

  // tslint:disable-next-line
  console.log(brick);
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

        return result;
      })
    )).map(toBrick)
  };
};

export const addBrick = async (brick: IBrick): Promise<number> => {
  if (!rpcService.mainAccount) { throw new Error("Metamask required"); }

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
    return contract.startWork(brickId, builderId, builderName, options, cb);
  });

  return result;
};
