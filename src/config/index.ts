import development from "./development";
import production from "./production";

const MAINET_RPC_URL = "https://mainnet.infura.io/aJZ5aKsYEChL8ve7kFzC";
const ROPSTEN_RPC_URL = "https://ropsten.infura.io/aJZ5aKsYEChL8ve7kFzC";
const KOVAN_RPC_URL = "https://kovan.infura.io/aJZ5aKsYEChL8ve7kFzC";
const RINKEBY_RPC_URL = "https://rinkeby.infura.io/aJZ5aKsYEChL8ve7kFzC";

const defaultConfig = {
  CONTRACT_ABI: [
    {
      constant: false,
      inputs: [
        {
          name: "_address",
          type: "address"
        }
      ],
      name: "upgradeProvider",
      outputs: [
        {
          name: "",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_version",
          type: "uint256"
        }
      ],
      name: "getProviderDetails",
      outputs: [
        {
          name: "_start",
          type: "uint256"
        },
        {
          name: "_end",
          type: "uint256"
        },
        {
          name: "_address",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_id",
          type: "uint256"
        }
      ],
      name: "getProviderById",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "getAllProviders",
      outputs: [
        {
          name: "addresses",
          type: "address[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "getCurrentProvider",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "DENOMINATOR",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "currentVersion",
      outputs: [
        {
          name: "",
          type: "uint16"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_newId",
          type: "uint256"
        }
      ],
      name: "resetCurrentIdTo",
      outputs: [
        {
          name: "success",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "currentId",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_newOwner",
          type: "address"
        }
      ],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "VERSION",
      outputs: [
        {
          name: "",
          type: "string"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      payable: true,
      stateMutability: "payable",
      type: "fallback"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "_brickId",
          type: "uint256"
        }
      ],
      name: "BrickAdded",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "_brickId",
          type: "uint256"
        }
      ],
      name: "BrickUpdated",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "_brickId",
          type: "uint256"
        }
      ],
      name: "BrickCancelled",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "_brickId",
          type: "uint256"
        },
        {
          indexed: false,
          name: "_builderAddress",
          type: "address"
        }
      ],
      name: "WorkStarted",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "_brickId",
          type: "uint256"
        },
        {
          indexed: false,
          name: "_winners",
          type: "address[]"
        }
      ],
      name: "WorkAccepted",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "previousOwner",
          type: "address"
        }
      ],
      name: "OwnershipRenounced",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "previousOwner",
          type: "address"
        },
        {
          indexed: true,
          name: "newOwner",
          type: "address"
        }
      ],
      name: "OwnershipTransferred",
      type: "event"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address"
        }
      ],
      name: "getBrickIdsByOwner",
      outputs: [
        {
          name: "brickIds",
          type: "uint256[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_builder",
          type: "address"
        }
      ],
      name: "getBrickIdsByBuilder",
      outputs: [
        {
          name: "brickIds",
          type: "uint256[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_skip",
          type: "uint256"
        },
        {
          name: "_take",
          type: "uint256"
        },
        {
          name: "_tags",
          type: "bytes32[]"
        },
        {
          name: "_status",
          type: "uint256"
        },
        {
          name: "_started",
          type: "uint256"
        },
        {
          name: "_expired",
          type: "uint256"
        }
      ],
      name: "getBrickIds",
      outputs: [
        {
          name: "brickIds",
          type: "uint256[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_title",
          type: "string"
        },
        {
          name: "_url",
          type: "string"
        },
        {
          name: "_expired",
          type: "uint256"
        },
        {
          name: "_description",
          type: "string"
        },
        {
          name: "_tags",
          type: "bytes32[]"
        }
      ],
      name: "addBrick",
      outputs: [
        {
          name: "id",
          type: "uint256"
        }
      ],
      payable: true,
      stateMutability: "payable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_brickId",
          type: "uint256"
        },
        {
          name: "_title",
          type: "string"
        },
        {
          name: "_url",
          type: "string"
        },
        {
          name: "_description",
          type: "string"
        },
        {
          name: "_tags",
          type: "bytes32[]"
        }
      ],
      name: "changeBrick",
      outputs: [
        {
          name: "success",
          type: "bool"
        }
      ],
      payable: true,
      stateMutability: "payable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_brickId",
          type: "uint256"
        },
        {
          name: "_winners",
          type: "address[]"
        },
        {
          name: "_weights",
          type: "uint256[]"
        }
      ],
      name: "accept",
      outputs: [
        {
          name: "success",
          type: "bool"
        }
      ],
      payable: true,
      stateMutability: "payable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_brickId",
          type: "uint256"
        }
      ],
      name: "cancel",
      outputs: [
        {
          name: "success",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_brickId",
          type: "uint256"
        },
        {
          name: "_builderId",
          type: "bytes32"
        },
        {
          name: "_nickName",
          type: "bytes32"
        }
      ],
      name: "startWork",
      outputs: [
        {
          name: "success",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_brickId",
          type: "uint256"
        }
      ],
      name: "getBrick",
      outputs: [
        {
          name: "title",
          type: "string"
        },
        {
          name: "url",
          type: "string"
        },
        {
          name: "owner",
          type: "address"
        },
        {
          name: "value",
          type: "uint256"
        },
        {
          name: "dateCreated",
          type: "uint256"
        },
        {
          name: "dateCompleted",
          type: "uint256"
        },
        {
          name: "expired",
          type: "uint256"
        },
        {
          name: "status",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_brickId",
          type: "uint256"
        }
      ],
      name: "getBrickDetail",
      outputs: [
        {
          name: "tags",
          type: "bytes32[]"
        },
        {
          name: "description",
          type: "string"
        },
        {
          name: "builders",
          type: "uint32"
        },
        {
          name: "winners",
          type: "address[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_brickId",
          type: "uint256"
        }
      ],
      name: "getBrickBuilders",
      outputs: [
        {
          name: "addresses",
          type: "address[]"
        },
        {
          name: "dates",
          type: "uint256[]"
        },
        {
          name: "keys",
          type: "bytes32[]"
        },
        {
          name: "names",
          type: "bytes32[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    }
  ],
  // CONTRACT_ADDRESS: "0xf6ae46afaa49a2e7963e5bcd210988ff539b8034",
  // CONTRACT_ADDRESS: "0x4c77dae972749a67d78c404c0b58f9e217871a15",
  addresses: {
    "1": "0x0a64fe0b2587c31c511ae81c7b4c2cf8bb3b3cc6", // implementation: 0x65e871cd0e132e14b3bd9569199dcb436c752b2f
    "3": "0x20e3ef00bd74a3ac14704f45a12372cb999a8eac", // implementation: 0x32389232995be175465ff6c692a0c43c14d3813f
    "4": "",
    "42": "0x4c77dae972749a67d78c404c0b58f9e217871a15"
  },
  defaultNetwork: "42",
  network: {
    "1": MAINET_RPC_URL,
    "3": ROPSTEN_RPC_URL,
    "4": RINKEBY_RPC_URL,
    "42": KOVAN_RPC_URL
  },
  networkNames: {
    "1": "mainnet",
    "3": "ropsten",
    "4": "rinkeby",
    "42": "kovan"
  }
};

const env = process.env.NODE_ENV || "development";
const config = env === "development" ? development : production;

const mergedConfig = { ...defaultConfig, ...config };

export default mergedConfig;
