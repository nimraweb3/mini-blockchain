import { Blockchain } from "../src/blockchain";

describe("Blockchain", () => {
    test("starts with a valid genesis block", () => {
        const chain = new Blockchain(2);
        expect(chain.chain.length).toBe(1);
        expect(chain.chain[0].previousHash).toBe("0");
    });

    test("adds blocks correctly linked to the previous hash", () => {
        const chain = new Blockchain(2);
        chain.addBlock("first transaction");
        chain.addBlock("second transaction");

        expect(chain.chain.length).toBe(3);
        expect(chain.chain[1].previousHash).toBe(chain.chain[0].hash);
        expect(chain.chain[2].previousHash).toBe(chain.chain[1].hash);
    });

    test("mined blocks satisfy the difficulty target", () => {
        const difficulty = 3;
        const chain = new Blockchain(difficulty);
        chain.addBlock("some data");

        const target = "0".repeat(difficulty);
        expect(chain.chain[1].hash.substring(0, difficulty)).toBe(target);
    });

    test("a fresh chain is valid", () => {
        const chain = new Blockchain(2);
        chain.addBlock("tx 1");
        chain.addBlock("tx 2");

        expect(chain.isChainValid()).toBe(true);
    });

    test("detects tampered block data", () => {
        const chain = new Blockchain(2);
        chain.addBlock("tx 1");
        chain.addBlock("tx 2");

        chain.chain[1].data = "tampered data";

        expect(chain.isChainValid()).toBe(false);
    });

    test("detects a broken previousHash link", () => {
        const chain = new Blockchain(2);
        chain.addBlock("tx 1");
        chain.addBlock("tx 2");

        chain.chain[2].previousHash = "0000fakehash";

        expect(chain.isChainValid()).toBe(false);
    });
});