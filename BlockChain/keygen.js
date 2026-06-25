const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const keypair = ec.genKeyPair();
const publickey = keypair.getPublic('hex');
const privatekey = keypair.getPrivate('hex');

console.log();
console.log('Public Key: ', publickey);
console.log();
console.log('Private Key: ', privatekey);