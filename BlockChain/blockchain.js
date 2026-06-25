const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }
    signTransaction(signingKey) {
        if(signingKey.getPublic('hex') !== this.fromAddress) // fromAddress is the public key
            throw new Error('You can not sign transaction for other walleta!');
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64'); // we sign the hash using signinkey object
        this.signature = sig.toDER('hex'); // we save the signature so that we can varify in later that
    }
    isvalid() {
        if(this.fromAddress === null) // miners, so valid transaction
            return true;
        if(!this.signature || this.signature.length===0)
            throw new Error('No signature in this Transaction');
        const publickey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publickey.verify(this.calculateHash(), this.signature); // we are varifying if the hash is signed using this signature

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
    hasvalidTransaction() {
        for(const tx of this.transactions) {
            if(!tx.isvalid())
                return false;
        }
        return true;
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
        const rewdTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewdTx);

        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress)
            throw new Error('No transaction can be made without from and to address');
        if(!transaction.isvalid())
            throw new Error('Cannot add invalid transaction..');

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
            if(!current.hasvalidTransaction)
                return false;
            if(current.hash !== current.calculateHash())
                return false;
            if(previous.hash !== current.previousHash)
                return false;
        }
        return true;
    }

}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;