import { createHash } from "crypto";

/**
 * A single Block in the chain.
 *
 * Each block stores:
 *  - index        -> its position (0 = genesis)
 *  - timestamp    -> when it was created
 *  - data         -> the payload (a transaction, message, etc.)
 *  - previousHash -> the fingerprint of the block before it (the "link")
 *  - nonce        -> the number we brute-force during mining
 *  - hash         -> this block's own fingerprint (SHA-256)
 */
export class Block {
    public index: number;
    public timestamp: string;
    public data: string;
    public previousHash: string;
    public nonce: number;
    public hash: string;

    constructor(index: number, data: string, previousHash: string) {
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    /**
     * Squishes all fields into one string and runs it through SHA-256.
     * Same input -> always same output (determinism).
     * One tiny change anywhere -> a completely different hash (avalanche effect).
     */
    calculateHash(): string {
        const raw =
            this.index + this.timestamp + this.data + this.previousHash + this.nonce;
        return createHash("sha256").update(raw).digest("hex");
    }

    /**
     * Proof of Work: keep incrementing nonce and recalculating the hash
     * until it starts with `difficulty` number of zeros.
     */
    mineBlock(difficulty: number): void {
        const target = "0".repeat(difficulty);
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}