import { Blockchain } from "./blockchain";

function getDifficultyFromArgs(): number {
    const arg = process.argv.find((a) => a.startsWith("--difficulty="));
    if (!arg) return 4;
    const value = parseInt(arg.split("=")[1], 10);
    return Number.isNaN(value) ? 4 : value;
}

function main() {
    const difficulty = getDifficultyFromArgs();
    console.log(`Mini Blockchain, difficulty set to ${difficulty}\n`);

    const myChain = new Blockchain(difficulty);

    const transactions = [
        { sender: "Ali", receiver: "Sara", amount: 10 },
        { sender: "Sara", receiver: "Bilal", amount: 5 },
        { sender: "Bilal", receiver: "Ali", amount: 2 },
    ];

    transactions.forEach((tx, i) => {
        console.log(`Mining block ${i + 1}: ${tx.sender} sends ${tx.receiver} ${tx.amount} coins`);
        const start = Date.now();
        const block = myChain.addBlock(tx);
        const seconds = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`  mined in ${seconds}s | nonce=${block.nonce} | hash=${block.hash}\n`);
    });

    console.log("Full chain:");
    console.log(JSON.stringify(myChain.chain, null, 2));

    console.log("\nValidating chain...");
    console.log("Is chain valid?", myChain.isChainValid());

    console.log("\nTampering with block 1...");
    myChain.chain[1].data.amount = 1000;

    console.log("Validating chain again...");
    console.log("Is chain valid?", myChain.isChainValid());
}

main();