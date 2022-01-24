module.exports = ({ wallets, refs, config, client }) => ({
  getCount: () => client.query("counter", { get_count: {} }),
  getGreeting: () => client.query("counter", { get_greeting: {} }),
  increment: (signer = wallets.validator) =>
    client.execute(signer, "counter", { increment: {} }),
});
