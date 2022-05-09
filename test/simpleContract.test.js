'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const SimpleContract = require('../lib/simpleContract.js');

let assert = sinon.assert;
chai.use(sinonChai);

describe('Simple Chaincode Basic Tests', () => {
    let transactionContext, chaincodeStub, asset;
    beforeEach(() => {
        transactionContext = new Context();

        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        transactionContext.setChaincodeStub(chaincodeStub);

        chaincodeStub.putState.callsFake((key, value) => {
            if (!chaincodeStub.states) {
                chaincodeStub.states = {};
            }
            chaincodeStub.states[key] = value;
        });

        chaincodeStub.getState.callsFake(async (key) => {
            let ret;
            if (chaincodeStub.states) {
                ret = chaincodeStub.states[key];
            }
            return Promise.resolve(ret);
        });

        chaincodeStub.deleteState.callsFake(async (key) => {
            if (chaincodeStub.states) {
                delete chaincodeStub.states[key];
            }
            return Promise.resolve(key);
        });

        asset = {
            key: "100",
            value: "Black"
        };

    });

    describe('Test put function', () => {
        it('should return success on put function', async () => {
            let simpleContract = new SimpleContract();

            await simpleContract.put(transactionContext, asset.key, asset.value);

            let ret = await chaincodeStub.getState(asset.key);
            expect(ret.toString()).to.equal(asset.value);
        });
    });

    describe('Test get function', () => {
        it('should return error on get function', async () => {
            let simpleContract = new SimpleContract();
            await simpleContract.put(transactionContext, asset.key, asset.value);

            try {
                await simpleContract.get(transactionContext, '101');
                assert.fail('get function should have failed');
            } catch (err) {
                expect(err.message).to.equal('The asset 101 does not exist');
            }
        });

        it('should return success on get function', async () => {
            let simpleContract = new SimpleContract();
            await simpleContract.put(transactionContext, asset.key, asset.value);

            let ret = await chaincodeStub.getState(asset.key);
            expect(ret.toString()).to.equal(asset.value);
        });
    });

    describe('Test delete function', () => {
        it('should return error on delete function', async () => {
            let simpleContract = new SimpleContract();
            await simpleContract.put(transactionContext, asset.key, asset.value);

            try {
                await simpleContract.get(transactionContext, '101');
                assert.fail('delete function should have failed');
            } catch (err) {
                expect(err.message).to.equal('The asset 101 does not exist');
            }
        });

        it('should return success on delete function', async () => {
            let simpleContract = new SimpleContract();
            await simpleContract.put(transactionContext, asset.key, asset.value);

            await chaincodeStub.deleteState(asset.key);
            let ret = await chaincodeStub.getState(asset.key);
            expect(ret).to.equal(undefined);
        });
    });
});