import type { NextPage } from "next";
import styled from "styled-components";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import * as execute from "../src/contract/execute";
import * as query from "../src/contract/query";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-provider";
import { Text } from "../src/coreui-components";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

const SendPage: NextPage = () => {
  const connectedWallet = useConnectedWallet();
  const [count, setCount] = useState<number>();
  const [updating, setUpdating] = useState(false);
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const onClickSendGift = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUpdating(true);
    const response = await execute.sendGift({
      amount,
      receiver,
      gift_msg: giftMessage,
    })(connectedWallet);

    if (response.logs) {
      const giftId = response.logs[0].events
        .find((event) => event.type === "from_contract")
        ?.attributes.find((attribute) => attribute.key === "gift_id")?.value;

      if (giftId) {
        alert(`Your gift id is: ${giftId}`);
      }
    }
    setUpdating(false);
  };

  // Use Title and Wrapper like any other React component – except they're styled!
  return (
    <Wrapper>
      {updating && (
        <div>
          <Text>Submitting</Text>
        </div>
      )}

      <form onSubmit={onClickSendGift}>
        <label>
          Amount:
          <input
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            type="number"
          />
        </label>
        <div />
        <label>
          Receiver:
          <input
            value={receiver}
            onChange={(e) => {
              setReceiver(e.target.value);
            }}
          />
        </label>
        <div />
        <label>
          Message:
          <textarea
            value={giftMessage}
            onChange={(e) => {
              setGiftMessage(e.target.value);
            }}
          />
        </label>
        <div />
        <input type="submit" value="Submit" />
      </form>
    </Wrapper>
  );
};

export default SendPage;
