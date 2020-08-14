var Web3 = require('web3');
var truffleContract = require("@truffle/contract");

const uri = "http://localhost:8545";

var web3 = new Web3(uri);

var provider = new Web3.providers.HttpProvider(uri);

let address1 = '0xCFd6f5C0320EBceB5fE9672276741EFF510D7c1B';
let address2 = '0xB091Eb5ce0933CB9162041855147cDc03e0abEBA';
let address3 = '0xC75E3c4911069e2087d6EC13444d9f21A32C3380';

const Master = require("./build/contracts/Master.json");
const Token = require("./build/contracts/Token.json");

const getHash = (value) => {
    return web3.utils.keccak256(value)
}

async function main() {
    let r;
    const master = await new web3.eth.Contract(Master.abi, "0xEa2f6EEbD704d959063FfceAf05f306463a97c22");
    const proxy = await new web3.eth.Contract(Token.abi, "0xEa2f6EEbD704d959063FfceAf05f306463a97c22");
    const token = await new web3.eth.Contract(Token.abi, "0x5a4910A537D978Df7752c0f2992F4fC69516b040");


    await proxy.methods.setN(12).send({from: address1})

    r = await proxy.methods.n().call()
    console.log(r);

}

main();
