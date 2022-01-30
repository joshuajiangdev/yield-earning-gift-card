# Terragram
UST gift cards that earn yield on idle funds.

Built at Miami Hack Week by [Joshua](https://github.com/joshuajiangdev) and [Julia](https://github.com/jw122) at the Spacecamp / Terra house.

Links: 
[App](https://terragram.vercel.app/send) | [Devpost](https://devpost.com/software/terragrams) | [Video Demo](https://youtu.be/QeCqf0JX-sw)

## Inspiration
Our goal is to bring the power of decentralized stablecoins like UST to the hands of everyday users, by showing them certain benefits that wouldn't be possible with most traditional financial products.
Many communities and cultures around the world have the habit of gifting money or gift cards for special occasions. What if, with UST and Terra, you could give decentralized stablecoins to your friends in gift cards that actually grow while the funds are not spent?

## What it does
A user decides how much UST they want to gift a friend. Terragram deposits the money into Anchor, earning up to 20% APY. When the recipient claims the gift card, they can claim the funds with the yield earned! Or just keep the card as savings.

## How we built it
We built a react app powered by Next.js that interacts with CosmWasm smart contracts written in Rust. There is one smart contract that controls all the gifted UST and keeps track of the gift sender and receivers. This smart contract also deposits the stablecoins into Anchor's smart contract, which generates yield.

The core Terragram contract maintains a mapping of each gift and recipient, and also interacts with Anchor for deposits and withdrawals.

## Challenges we ran into
- We had to figure out how to interact with Anchor directly through smart contract calls, while most of the existing documentation uses Javascript SDKs.
- We were a team of two, and mostly new to CosmWasm and Rust!

## Accomplishments that we're proud of
- We have an end to end experience
- We have smart contracts deployed to testnet
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
