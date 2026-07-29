# Mini Blockchain

A small blockchain built in TypeScript. It hashes data, mines new blocks, and checks the chain for tampering. No blockchain libraries used, everything is written manually so you can see how it works.

## What this actually is

Picture a chain of boxes. Each box holds some data and a fingerprint of itself. It also holds a copy of the fingerprint from the box right before it, and that link is what turns a pile of boxes into a chain.

```
   Block 0            Block 1            Block 2
  (Genesis)                              
 ┌─────────┐        ┌─────────┐        ┌─────────┐
 │ data    │        │ data    │        │ data    │
 │ prev: 0 │───hash─▶│ prev: ●│───hash─▶│ prev: ●│
 │ hash:0000..│      │ hash:0000..│     │ hash:0000..│
 └─────────┘        └─────────┘        └─────────┘
```

Edit a box's data after the fact and its fingerprint changes, but the next box is still holding onto the old one. That mismatch is instant and impossible to hide.

Making a new box isn't free either. Before it can join the chain, its fingerprint has to satisfy a difficulty rule (a certain number of leading zeros), and finding one that qualifies takes real computation. That's mining, and it's what makes faking the chain expensive instead of just inconvenient.

Cheap to verify, expensive to fake. That's the one idea every blockchain is built on underneath everything else, and this repo implements it in its purest form.

## What it does

Each block stores some data, the hash of the block before it, and its own hash. If you change a block's data, its hash no longer matches, and the next block is still pointing at the old hash. That's how the code detects tampering.

Before a block can be added, it has to be mined. Mining means trying different numbers (a nonce) until the block's hash starts with a set number of zeros. This takes a bit of time and computing power, which is the point.

## Project structure

```
mini-blockchain/
├── src/
│   ├── Block.ts
│   ├── Blockchain.ts
│   └── index.ts
├── tests/
│   └── blockchain.test.ts
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── jest.config.js
```

`Block.ts` has the Block class, hashing, and mining.
`Blockchain.ts` manages the chain and validates it.
`index.ts` runs a demo: mines a few blocks, checks the chain, then tampers with one block to show validation catching it.

## How to run it

```bash
git clone https://github.com/nimraweb3/mini-blockchain.git
cd mini-blockchain
npm install
npm run dev
```

To try a higher mining difficulty:

```bash
npm start -- --difficulty=5
```

To run the tests:

```bash
npm test
```

To build and run the compiled version:

```bash
npm run build
npm start
```

## Example output

```
Mining block 1: "Ali sends Sara 10 coins"
  mined in 0.23s | nonce=114192 | hash=0000ed0d7f2d...

Is chain valid? true

Tampering with block 1...
Is chain valid? false
```

## Tests

6 tests covering: genesis block creation, block linking, mining difficulty, chain validation, tampered data detection, and broken link detection.

## Built with

TypeScript, Node.js, Jest.
