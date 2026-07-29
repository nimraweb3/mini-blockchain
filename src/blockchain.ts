import { Block, Transaction } from "./block";

export class Blockchain {
    chain: Block[];
    difficulty: number;

    constructor(difficulty: number = 4) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
    }

    private createGenesisBlock(): Block {
        const genesisTransaction: Transaction = {
            sender: "network",
            receiver: "network",
            amount: 0,
        };
        return new Block(0, genesisTransaction, "0");
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data: Transaction): Block {
        const newBlock = new Block(
            this.chain.length,
            data,
            this.getLatestBlock().hash
        );
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        return newBlock;
    }

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