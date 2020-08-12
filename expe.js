var Web3 = require('web3');
var truffleContract = require("@truffle/contract");

const uri = "http://localhost:8545";

var web3 = new Web3(uri);

var provider = new Web3.providers.HttpProvider(uri);

let address1 = '0xCFd6f5C0320EBceB5fE9672276741EFF510D7c1B';
let address2 = '0xB091Eb5ce0933CB9162041855147cDc03e0abEBA';
let address3 = '0xC75E3c4911069e2087d6EC13444d9f21A32C3380';

const LogisticBase = require("./app/src/contracts/LogisticBase.json");
const logisticBaseAddress = "0x0Ad3f42B09fE91326E8763622220841Ee6CC8cde"
const Logistic = require("./app/src/contracts/Logistic.json");
const logisticAddress = "0x7167aF8e235dBA1Efb23191ecc16b1FBc6a3C6F8";

const getHash = (value) => {
    return web3.utils.keccak256(value)
}

async function main() {
    let r;
    const logisticBase = await new web3.eth.Contract(LogisticBase.abi, logisticBaseAddress);
    const proxy = await new web3.eth.Contract(LogisticBase.abi, logisticAddress);
    const logistic = await new web3.eth.Contract(Logistic.abi, logisticAddress);

    // r = await logisticBase.methods.getProductInfo(getHash("1")).call()
    // console.log(r);


    r = await logisticBase.methods.howIAm(12).call()
    console.log(r);
    // r = await logistic.methods.test().call()
    // console.log("test tolistic: ", r);
    // r = await logisticBase.methods.owner().call()
    // console.log("owner: ", r);
    // r = await logisticBase.methods.logistic().call()
    // console.log("logstic: ", r);

    r = await proxy.methods.howIsCalling().send({from: address1})
    console.log(r);

    // r = await logistic.methods.howIAm().call()
    // console.log(r);
    // try {
    //     r = await proxy.methods.howIAm().call()
    //     console.log(r);
    // } catch (e) {
    //     console.log(e);
    // }
    // web3.eth.sendTransaction({
    //     from: address1,
    //     to: logisticAddress,
    //     // data: optional, if you want to pass data or specify another function to be called by delegateCall you do that here
    //     data: logisticBase.methods.test().encodeABI(),
    //     // gas: requiredGas, // technically optional, but you almost certainly need more than the default 21k gas
    //     // value: value //optional, if you want to pay the contract Ether
    // }).then(r => console.log("test:", r))
    // .catch(e => console.log(e))
    // .then(() => {
    //     return logistic.getPastEvents('allEvents')
    // })
    // .then(events => {
    //     console.log(events);
    // });

    // web3.eth.sendTransaction({
    //     from: address1,
    //     to: logisticAddress,
    //     // data: optional, if you want to pass data or specify another function to be called by delegateCall you do that here
    //     data: logisticBase.methods.addSupplier(address2, "philiiiiippe").encodeABI(),
    //     // gas: requiredGas, // technically optional, but you almost certainly need more than the default 21k gas
    //     // value: value //optional, if you want to pay the contract Ether
    // }).then(r => console.log(r))
    // .catch(e => console.log(e));

    // web3.eth.call({
    //     from: address1,
    //     to: logisticAddress,
    //     // data: optional, if you want to pass data or specify another function to be called by delegateCall you do that here
    //     data: logisticBase.methods.howIAm(92).encodeABI(),
    //     // gas: requiredGas, // technically optional, but you almost certainly need more than the default 21k gas
    //     // value: value //optional, if you want to pay the contract Ether
    // }).then(r => console.log("how i am proxy: ", r))
    // .catch(e => console.log(e));
}

main();
