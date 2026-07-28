# Mini Blockchain

A blockchain built from scratch in TypeScript. No libraries doing the hard part — just SHA-256 hashing, real Proof-of-Work mining, and chain validation, written out so you can see exactly how it works.

## What this actually is

Think of it as a chain of boxes. Each box holds some data and a fingerprint of itself. It also holds a copy of the fingerprint from the box right before it, which is what links them together.

If someone edits a box's data after the fact, its fingerprint changes, but the next box is still holding onto the old fingerprint. That mismatch is instantly obvious, which is the whole point.

Making a new box also isn't free. Before it can join the chain, its fingerprint has to satisfy a difficulty rule (start with a certain number of zeros), and finding one that does takes real computation. That's mining, and it's what makes faking the chain expensive instead of just inconvenient.

This one mechanism (cheap to verify, expensive to fake) is what every blockchain is built on underneath everything else.

## How it's put together

**Hashing.** Every block runs its own data through SHA-256. Same input always produces the same output, but change one character and the output is completely different.

**Linking.** Each block stores the hash of the block before it. That's the actual "chain" part.

**Mining.** Before a block gets added, its hash has to start with N zeros. Getting there means trying thousands of nonce values until one works.

**Validation.** A function walks the whole chain checking two things per block: does its data still match its stored hash, and is it still linked correctly to the block before it. One failure anywhere and the whole chain is rejected.

## Project structure

```
mini-blockchain/
├── src/
│   ├── Block.ts          Block class: hashing + mining
│   ├── Blockchain.ts     Blockchain class: chain management + validation
│   └── index.ts          entry point / demo
├── tests/
│   └── blockchain.test.ts
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── jest.config.js
```

## Running it yourself

Clone it and install:

```bash
git clone https://github.com/nimraweb3/mini-blockchain.git
cd mini-blockchain
npm install
```

Run the demo (mines 3 blocks, validates the chain, then simulates someone tampering with it):

```bash
npm run dev
```

Try a higher mining difficulty to see it slow down:

```bash
npm start -- --difficulty=5
```

Run the tests:

```bash
npm test
```

Build for production and run the compiled version:

```bash
npm run build
npm start
```

## What you'll see

```
Mining block 1: "Ali sends Sara 10 coins"
  mined in 0.23s | nonce=114192 | hash=0000ed0d7f2d...

Is chain valid? true

Simulating an attacker tampering with block 1...
Is chain valid? false
```

## Tech used

TypeScript, Node.js, the built-in crypto module for SHA-256, Jest for testing, GitHub Actions for CI.