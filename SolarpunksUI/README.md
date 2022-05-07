[![Changelog](https://github.com/rtang03/solarpunks/actions/workflows/changelog.yaml/badge.svg)](https://github.com/rtang03/solarpunks/actions/workflows/changelog.yaml)

# Solarpunks

Developed at [LFGrow Hackathon 2022](https://showcase.ethglobal.com/lfgrow/solarpunks-86vjx)
[Live Demo](https://solarpunks.vercel.app/)

## About
This project uses Profile, Publication, Timeline, Follow, Explore, and NFT functions from Lens API to build a social graph on top of [Punk Cities](https://punkcity.surge.sh/) game and let users connect locally through decentralized social networks based on public places and commons minted as NFTs and meet new friends globally.


### Pre-requisite

- Lens-API latest
- NodeJs >= 14.x
- NextJs 12.x
- Tailwindcss v3.x
- Solidity latest
- Moralis SDK
- EthersJs v5.x
- Apollo client v3.x
- Metamask

### Backend service

- [Moralis](https://moralis.io)
- [NFT.storage](https://nft.storage)


## Contracts

[📚 Lens Hub](https://mumbai.polygonscan.com/address/0xd7B3481De00995046C7850bCe9a5196B7605c367)  
[📚 Punk Cities](https://mumbai.polygonscan.com/address/0x89a5e08f445a561ff62dde53d9e071c32634a688)

## TLDR;

### Dev Environemnt

Working with Polygon Mumbai testnet contracts (further update to deploy your own contracts)

0. Install [Metamask](https://metamask.io)

1. Register accounts in [Moralis](https://moralis.io) and [NFT.storage](https://nft.storage)

2. Make `.env.local`

```shell
touch .env.local
```

add environment variable

```text
NEXT_PUBLIC_NFT_TOKEN="eyJhbGciOi........"
```

3. Install dependencies

```bash
yarn install
```

4. Start developmment

```bash
yarn dev
```

5. 📱 Open http://localhost:3000 to see the app

### Production

Live deployment is made via Github / Vercel integration, as a vercel.app; from master branch.

Open [solarpunks.vercel.app](https://solarpunks.vercel.app)


### Related to LensAPI integration

1. Apollo Client

We adapt the Apollo provider to call LensAPI, [source](https://github.com/rtang03/solarpunks/blob/master/lib/apolloClient.js).

2. React hooks

We develop 2 react hooks for orchreshration, when submitting transaction.

- [useSendTransWithSig](https://github.com/rtang03/solarpunks/blob/master/hooks/useSendTransWithSig.js)
- [useQueryTxIndexed](https://github.com/rtang03/solarpunks/blob/master/hooks/useQueryTxIndexed.js)

