import { Blockchain } from "./blockchain";

/**
 * Entry point. This is what runs when you type `npm start`.
 *
 * Supports an optional CLI flag:
 *   npm start -- --difficulty=5
 */
function getDifficultyFromArgs(): number {
    const arg = process.argv.find((a) => a.startsWith("--difficulty="));
    if (!arg) return 4;
    const value = parseInt(arg.split("=")[1], 10);
    return Number.isNaN(value) ? 4 : value;
}

function main() {
    const difficulty = getDifficultyFromArgs();
    console.log(`\n🔗 Mini Blockchain — difficulty set to ${difficulty}\n`);

    const myChain = new Blockchain(difficulty);

    const transactions = [
        "Ali sends Sara 10 coins",
        "Sara sends Bilal 5 coins",
        "Bilal sends Ali 2 coins",
    ];

    transactions.forEach((tx, i) => {
        console.log(`Mining block ${i + 1}: "${tx}"`);
        const start = Date.now();
        const block = myChain.addBlock(tx);
        const seconds = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`  ✅ mined in ${seconds}s | nonce=${block.nonce} | hash=${block.hash}\n`);
    });

    console.log("Full chain:");
    console.log(JSON.stringify(myChain.chain, null, 2));

    console.log("\nValidating chain...");
    console.log("Is chain valid?", myChain.isChainValid());

    console.log("\n⚠️  Simulating an attacker tampering with block 1...");
    myChain.chain[1].data = "Ali sends Sara 1000 coins";

    console.log("Validating chain again...");
    console.log("Is chain valid?", myChain.isChainValid());
}

main();