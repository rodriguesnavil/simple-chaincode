
# The Contract Class
In Hyperledger Fabric, a smart contract needs to inherit all the methods from the contract class which is provided in the fabric-contract-api npm package. These different methods are called in response to transactions that are invoked on the blockchain. The Contract class is declared in the fabric-contract-api npm package:

```bash
export class Contract {
    constructor(name?: string);
    static _isContract(): boolean;
    beforeTransaction(ctx: Context): Promise<void>;
    afterTransaction(ctx: Context, result: any): Promise<void>;
    unknownTransaction(ctx: Context): Promise<void>;
    createContext(): Context;
    getName(): string;
}
```

Considering the above, we can implement a simple contract, that does nothing valuable, but can be
operated in the network:
```bash
'use strict';

const { Contract } = require('fabric-contract-api');

class SimpleContract extends Contract {

    async put(ctx, key, value) {
        await ctx.stub.putState(key, Buffer.from(value));
    }

    async get(ctx, key) {
        const value = await ctx.stub.getState(key);
        if (!value || value.length === 0) {
            throw new Error(`The asset ${key} does not exist`);
        }

        return value.toString();
    }

    async del(ctx, key) {
        await ctx.stub.deleteState(key);
    }
    
}

module.exports = SimpleContract;
```
Let’s save this chaincode in a simpleContract.js file into the simple_chaincode/lib folder.

# Node.js Chaincode Structure
As we are using Node.js to write our chaincode we need to also specify the dependencies, engines, start script and main entry point file for the execution in the package.json file. A basic package.json file looks as follows:
```bash
{
    "name": "simple_chaincode",
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
    "start": "fabric-chaincode-node start"
    },
    "engines": {
        "node": ">=12",,
        "npm": ">=5"
    },
    "dependencies": {
        "fabric-contract-api": "^2.2.0",
        "fabric-shim": "^2.2.0"
    }
}
```
The main entry point of a chaincode package should be set to index.js containing
exports of an npm module.
```bash
'use strict';
const simpleContract = require('./lib/simpleContract');
module.exports.SimpleContract = simpleContract;
module.exports.contracts = [simpleContract];
```
It is mandatory to have the contracts element exported in index.js. contracts is an array of classes
that are inheritors of the Contract class

# The ChaincodeStub Interface

## ChaincodeStub Function Groups

Get/Put data into the ledger or private collections

- getState
- putState
- getPrivateData ..

Perform complex queries

- getStateByRange
- getStateByPartialCompositeKey
- getQueryResult ..

Fetch transaction proposal details
- getArgs
- getCreator
- getChannelID .. 

Make invocations between chaincodes
- invokeChaincode .. 

Emit chaincode events

- setEvent .. 

Simplify chaincode development (helper functions)

- getFunctionAndParameters
- splitCompositeKey ..

# Simple Interaction with Ledger Data: getState, putState, delState

Functions provided by ChaincodeStub interface

- putState 
```bash
putState(key string, value: Uint8Array): Promise <void>
```

- getState 
```bash
getState(key string): Promise<Uint8Array>
```

- delState 
```bash
delState(key string): Promise<Uint8Array>
```