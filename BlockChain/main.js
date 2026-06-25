const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const mykey = ec.keyFromPrivate('6d657aff0ec7240a68a3112172d5dec1dc4dc0e6847134f6b8cb5515852c5715');
const mywalletaddr = mykey.getPublic('hex');

let bitcoin = new Blockchain();

const tx1 = new Transaction(mywalletaddr, 'public key goes here', 10);
tx1.signTransaction(mykey);
bitcoin.addTransaction(tx1);


console.log('\nStarting the miner...');
bitcoin.minePendingTransactions(mywalletaddr);

console.log("\nBalance of miner ", bitcoin.getBalanceOfAddress(mywalletaddr));




// console.log('\nStarting Miner again...');
// bitcoin.minePendingTransactions("miner1");
// console.log('\nBalance of miner ', bitcoin.getBalanceOfAddress('miner1'));


// console.log("Mining Block 1....")
// bitcoin.addBlock(new Block(1, "2/3/2022", {amount : 4}));

// console.log("Mining Block 2....")
// bitcoin.addBlock(new Block(2, "10/3/2022", {amount : 10}));

// console.log("Is valid chain: " + bitcoin.ischainValid());

// bitcoin.chain[1].data = {amount : 100};
// bitcoin.chain[1].hash = bitcoin.chain[1].calculateHash();
// console.log("Is valid chain: " + bitcoin.ischainValid());

// console.log(JSON.stringify(bitcoin, null, 4));