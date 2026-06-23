const SHA256 = require('crypto-js/sha256');
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
constructor(timestamp, transactions, previousHash='') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    mineBlock(difficulty) { // proof of work, slow down creating new blocks
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block Mined: " + this.hash);
    }
}
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    createGenesisBlock() {
        return new Block("10/1/2002", "Genesis Block", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address) {
        let balance = 0;
        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address)
                    balance -= trans.amount;
                if(trans.toAddress === address)
                    balance += trans.amount;
            }
        }
        return balance;
    }
    ischainValid() {
        for(let i=1; i<this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i-1];
            if(current.hash !== current.calculateHash())
                return false;
            if(previous.hash !== current.previousHash)
                return false;
        }
        return true;
    }
}
let bitcoin = new Blockchain();

bitcoin.createTransaction(new Transaction("address1", "address2", 100));
bitcoin.createTransaction(new Transaction("address2", "address1", 50));

console.log('\nStarting the miner...');
bitcoin.minePendingTransactions("miner1");
console.log("\nBalance of miner ", bitcoin.getBalanceOfAddress("miner1"));

console.log('\nStarting Miner again...');
bitcoin.minePendingTransactions("miner1");
console.log('\nBalance of miner ', bitcoin.getBalanceOfAddress('miner1'));


// console.log("Mining Block 1....")
// bitcoin.addBlock(new Block(1, "2/3/2022", {amount : 4}));

// console.log("Mining Block 2....")
// bitcoin.addBlock(new Block(2, "10/3/2022", {amount : 10}));

// console.log("Is valid chain: " + bitcoin.ischainValid());

// bitcoin.chain[1].data = {amount : 100};
// bitcoin.chain[1].hash = bitcoin.chain[1].calculateHash();
// console.log("Is valid chain: " + bitcoin.ischainValid());

// console.log(JSON.stringify(bitcoin, null, 4));