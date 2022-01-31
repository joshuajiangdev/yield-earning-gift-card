# Terragram
UST gift cards that earn yield on idle funds.

Built at Miami Hack Week by [Joshua](https://github.com/joshuajiangdev) and [Julia](https://github.com/jw122) at the Spacecamp / Terra house.

[App](https://terragram.vercel.app/send) | [Devpost](https://devpost.com/software/terragrams) | [Video Demo](https://youtu.be/QeCqf0JX-sw)

## Inspiration
Our goal is to bring the power of decentralized stablecoins like UST to the hands of everyday users, by showing them certain benefits that wouldn't be possible with most traditional financial products.

Many communities and cultures around the world have the habit of gifting money or gift cards for special occasions. What if, with UST and Anchor, you could send gift cards with funds that grow while the funds are not spent?

## What it does
The mental model/form factor of a Terragram is similar to that of a [Visa prepaid gift card](https://usa.visa.com/pay-with-visa/cards/prepaid-cards.html). 
A sender decides how much UST they want to deposit into a gift card. Through the Terragram UI, they deposit funds and specify the following:
1. A recipient's Terra address (or soon TNS name)
2. Gift amount
3. A special message


Terragram records the information above in its smart contract, and deposits the gift money into Anchor. 

While the gifted funds are not claimed/spent by the recipient, they are earning close to 20% APY through Anchor. The actual APY will depend on the prevailing APY on Anchor.
When the recipient claims the gift card, they will also claim the funds with the yield earned! Or just keep the card as a constantly growing savings account.


## How we built it
We built a react app powered by Next.js that interacts with CosmWasm smart contracts written in Rust. There is one smart contract that controls all the gifted UST and keeps track of the gift sender and receivers. This smart contract also deposits and withdraws the stablecoins into/from Anchor's smart contract, which generates yield.

The stack:

- Server: Next.js and Vercel deployment
- Smart contracts: Written in Rust, using CosmWasm platform
- UI: React + Typescript, [Material UI](https://mui.com/)

Toos we used:
- Terrain, a Terra development environment for better smart contract development experience
- LocalTerra, a complete Terra testnet and ecosystem containerized with Docker. Used to simulate transactions in a local test environment
- CosmWasm, a smart contracting platform built for the Cosmos ecosystem

## Challenges we ran into
- We had to figure out how to interact with Anchor directly through smart contract calls, while most of the existing documentation uses Javascript SDKs. We ended up borrowing from [Pylon](https://github.com/pylon-protocol/pylon-core-contracts/tree/442d8fbc378cdc761c909570f03b6c9983d15430/contracts)'s implementation.
- Gas estimates for frontend clients is not straightforward. We kept running into "out of gas" issues in the deposit flow, and ultimately found the cause of the issue to be in the fee that we must manually pass into the Terra.js client.
- We were a team of two, and mostly new to CosmWasm and Rust!

## Accomplishments that we're proud of
- We have an end to end, full stack experience
- We have smart contracts deployed to testnet
- We have a web app in production
- We were able to build an app with a UI that showcases the power of decentralized stablecoins and anchor yield

## What we learned
- Learned about the ecosystem of tools for Terra developers (station, finder, terrain, etc)
- Writing some Rust for the first time
- Worked directly with core Terra developers who taught us various debugging and implementation techniques

## What's next for Terragrams
- Keep track of aUST (anchor UST) which is the token representing a user's deposits in Anchor. This will help us properly track the yield for every money gift
- Deploy our smart contracts and app to production
- Investigate the relevance of tools like Pylon for more effectively routing yield to their respective recipients
- Implement yield splitting among the receiver AND sender, so that the person who makes the gift can also benefit from the beneficiary's saving habits :)
- Test with real users!
