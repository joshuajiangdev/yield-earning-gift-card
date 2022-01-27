module.exports = ({ wallets, refs, config, client }) => ({
  getCount: () => client.query("counter", { get_count: {} }),
  getGreeting: () => client.query("counter", { get_greeting: {} }),
  increment: (signer = wallets.validator) =>
    client.execute(signer, "counter", { increment: {} }),
  // NOTE: the first parameters passed in will override the implicit signer field
  // the last parameter into client.execute() is the name of the function in brackets, along with the args into that function
  send_gift: (receiver, amount, msg, signer = wallets.validator) =>
    client.execute(signer, "counter", {
      send_gift: {
        receiver: receiver,
        amount: amount,
        gift_msg: msg,
      },
    }),
});
