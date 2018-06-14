import * as _ from "lodash";
import Config from "../config";
import Promisify from "../helpers/Promisify";
import { IBrick } from "../types";
import rpcService from "./RpcService";

export const toBrick = (arr: any[]): IBrick => {
  const brick = {
    dateCompleted: rpcService.rpc.toBigNumber(arr[7]).toNumber(),
    dateCreated: rpcService.rpc.toBigNumber(arr[6]).toNumber(),
    description: arr[2],
    owner: rpcService.rpc.toHex(arr[3]),
    status: rpcService.rpc.toBigNumber(arr[4]).toNumber(),
    title: arr[0],
    url: arr[1],
    value: rpcService.rpc.fromWei(
      rpcService.rpc.toBigNumber(arr[5]).toString(),
      "ether"
    ),
    winner: rpcService.rpc.toHex(arr[8])
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
  let ids: number[] = await Promisify<number[]>((cb: any) =>
    contract.getBrickIds(cb)
  );
  ids = _(ids)
    .drop(start)
    .take(length)
    .value();

  return {
    brickCount: ids.length,
    bricks: (await Promise.all(
      ids.map(async id => await Promisify((cb: any) => contract.bricks(id, cb)))
    )).map(toBrick)
  };
};
