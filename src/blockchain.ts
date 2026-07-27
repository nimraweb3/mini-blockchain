import { Block } from "./block";

/**
 * Manages the full chain of blocks: creation, mining, and validation.
 */
export class Blockchain {
    public chain: Block[];
    public difficulty: number;

    constructor(difficulty: number = 4) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
    }

    private createGenesisBlock(): Block {
        // The first block has no parent, so previousHash is hardcoded to "0".
        return new Block(0, "Genesis Block", "0");
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Creates a new block, links it to the last block in the chain,
     * mines it (Proof of Work), then appends it.
     */
    addBlock(data: string): Block {
        const newBlock = new Block(
            this.chain.length,
            data,
            this.getLatestBlock().hash
        );
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        return newBlock;
    }

    /**
     * Walks the whole chain checking two things per block:
     *  1. Has the stored data been tampered with? (hash mismatch)
     *  2. Is this block still properly linked to the one before it?
     * A single failure anywhere invalidates the entire chain.
     */
    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            if (current.hash !== current.calculateHash()) {
                return false;
            }
            if (current.previousHash !== previous.hash) {
                return false;
            }
        }
        return true;
    }
}