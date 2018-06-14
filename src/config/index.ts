export default {
  CONTRACT_ABI: [
    {
      constant: true,
      inputs: [],
      name: "brickId",
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
      inputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      name: "bricks",
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
          name: "description",
          type: "string"
        },
        {
          name: "owner",
          type: "address"
        },
        {
          name: "status",
          type: "uint8"
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
          name: "winner",
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
          name: "",
          type: "uint256"
        }
      ],
      name: "brickIds",
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
      inputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      name: "subContracts",
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
      constant: false,
      inputs: [
        {
          name: "_id",
          type: "uint8"
        },
        {
          name: "_providerAddress",
          type: "address"
        }
      ],
      name: "setProvider",
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "name",
          type: "uint8"
        },
        {
          indexed: false,
          name: "hash",
          type: "address"
        }
      ],
      name: "ProviderUpdated",
      type: "event"
    },
    {
      constant: true,
      inputs: [],
      name: "getBrickIds",
      outputs: [
        {
          name: "",
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
          name: "_description",
          type: "string"
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
          name: "_builderAddress",
          type: "address"
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
          name: "_start",
          type: "uint256"
        }
      ],
      name: "resetBrickIdTo",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    }
  ],
  CONTRACT_ADDRESS: "0xacDf12f5d2399aAc089981DE900588aC8465DF2C"
};
