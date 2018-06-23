export default {
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
      name: "DONAMITOR",
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
          name: "_skip",
          type: "uint256"
        },
        {
          name: "_take",
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
          type: "string"
        },
        {
          name: "_nickName",
          type: "string"
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
          name: "description",
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
          name: "builders",
          type: "uint32"
        },
        {
          name: "status",
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
    }
  ],
  CONTRACT_ADDRESS: "0x6b47a963dDc5801312f64a92C2e9ae1Df6f68aC1"
};
