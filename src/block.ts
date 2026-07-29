import { createHash } from "crypto";

/**
 * A transaction payload. Instead of a plain string, a block now stores
 * structured data: who sent it, who received it, and how much.
 */
export interface Transaction {
    sender: string;
    receiver: string;
    amount: number;
}

export class Block {
    index: number;
    timestamp: string;
    data: Transaction;
    previousHash: string;
    nonce: number;
    hash: string;

    constructor(index: number, data: Transaction, previousHash: string) {
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash(): string {
        const raw =
            this.index +
            this.timestamp +
            JSON.stringify(this.data) +
            this.previousHash +
            this.nonce;
        return createHash("sha256").update(raw).digest("hex");
    }

    mineBlock(difficulty: number): void {
        const target = "0".repeat(difficulty);
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}