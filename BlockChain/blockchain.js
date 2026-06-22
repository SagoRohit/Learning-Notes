const SHA256 = require('crypto-js/sha256');
class Block {
constructor(index, timestamp, data, previousHash='') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block Mined:" + this.hash);
    }
}
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }
    createGenesisBlock() {
        return new Block(0, "10/1/2002", "Genesis Block", "0");
    }
    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock);
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
console.log("Mining Block 1....")
bitcoin.addBlock(new Block(1, "2/3/2022", {amount : 4}));

console.log("Mining Block 2....")
bitcoin.addBlock(new Block(2, "10/3/2022", {amount : 10}));

// console.log("Is valid chain: " + bitcoin.ischainValid());

// bitcoin.chain[1].data = {amount : 100};
// bitcoin.chain[1].hash = bitcoin.chain[1].calculateHash();
// console.log("Is valid chain: " + bitcoin.ischainValid());

// console.log(JSON.stringify(bitcoin, null, 4));