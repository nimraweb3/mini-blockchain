import { createHash } from "crypto";

// A "class" is just a blueprint for making objects. Think of it like a
// cookie cutter — this describes the SHAPE every Block will have.
class Block {
    index: number;          // which box is this? (0 = first box ever)
    timestamp: string;      // what time was this box made?
    data: string;           // whatever info you want to store in the box
    previousHash: string;   // the fingerprint of the box right before this one
    nonce: number;          // a counter we change over and over while "mining"
    hash: string;           // this box's OWN fingerprint

    // This special function runs automatically every time you write
    // `new Block(...)`
    constructor(index: number, data: string, previousHash: string) {
        this.index = index;
        this.timestamp = new Date().toISOString(); // grab the current time
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0; // start counting from zero
        this.hash = this.calculateHash(); // NOW we actually compute the real fingerprint
    }


    calculateHash(): string {
        const allInfoSquished =
            this.index + this.timestamp + this.data + this.previousHash + this.nonce;
        return createHash("sha256").update(allInfoSquished).digest("hex");
    }

    // "Mining" = keep trying nonce = 0, 1, 2, 3... recomputing the hash
    // each time... until the hash happens to start with enough zeros.
    mineBlock(difficulty: number): void {
        const target = "0".repeat(difficulty); // e.g. difficulty 4 -> "0000"
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;              // try the next guess
            this.hash = this.calculateHash(); // recompute the fingerprint with the new guess
        }
    }
}

// A Blockchain is just a LIST of Blocks, plus some helper functions.
class Blockchain {
    chain: Block[];      // the list of boxes, in order
    difficulty: number;  // how many zeros a hash must start with

    constructor(difficulty: number = 4) {
        // The very first box (called the "Genesis Block") has no parent,
        // so we just hardcode its previousHash to "0".
        const genesisBlock = new Block(0, "Genesis Block", "0");
        this.chain = [genesisBlock];
        this.difficulty = difficulty;
    }

    // A little helper: "give me the last box in the list"
    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    // Add a brand new box to the end of the chain.
    addBlock(data: string): void {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(this.chain.length, data, previousBlock.hash);
        newBlock.mineBlock(this.difficulty); // do the "hard work" before adding it
        this.chain.push(newBlock);
    }

    // Walk through every box, checking TWO things:
    //  1. If I recompute this box's fingerprint right now, do I get the
    //     SAME fingerprint it's already storing? (catches direct edits)
    //  2. Does this box's previousHash actually match the box before it?
    //     (catches boxes being removed, added, or reordered)
    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBox = this.chain[i];
            const boxBefore = this.chain[i - 1];

            if (currentBox.hash !== currentBox.calculateHash()) {
                console.log(`Box ${i} was tampered with! Its data doesn't match its fingerprint anymore.`);
                return false;
            }

            if (currentBox.previousHash !== boxBefore.hash) {
                console.log(`Box ${i} is not properly linked to the box before it!`);
                return false;
            }
        }
        return true; // if we got through every box with no problems, it's all good
    }
}

// ============================================================
// THE ACTUAL DEMO
// ============================================================

const myChain = new Blockchain(4); // 4 = how many zeros required (mining difficulty)

console.log("Mining box 1...");
myChain.addBlock("Ali pays Sara 10 coins");

console.log("Mining box 2...");
myChain.addBlock("Sara pays Bilal 5 coins");

console.log("Mining box 3...");
myChain.addBlock("Bilal pays Ali 2 coins");

console.log("\nIs our chain valid?", myChain.isChainValid()); // should say true

console.log("\nNow let's pretend someone sneaks in and changes box 1's data...");
myChain.chain[1].data = "Ali pays Sara 1000 coins"; // the cheat!

console.log("Is our chain STILL valid?", myChain.isChainValid()); // should say false