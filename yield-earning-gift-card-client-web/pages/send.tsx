import type { NextPage } from "next";
import styled from "styled-components";
import { LCDClient, Coin } from "@terra-money/terra.js";
import { useEffect, useState } from "react";
import * as execute from "../src/contract/execute";
import * as query from "../src/contract/query";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-provider";

const SendPage: NextPage = () => {
  const connectedWallet = useConnectedWallet();
  const [count, setCount] = useState<number>();
  const [updating, setUpdating] = useState(true);

  useEffect(() => {
    const prefetch = async () => {
      if (connectedWallet) {
        setCount((await query.getCount(connectedWallet)).count);
      }
      setUpdating(false);
    };
    prefetch();
  }, [connectedWallet]);

  const onClickIncrement = async () => {
    setUpdating(true);
    await execute.increment(connectedWallet);
    setCount((await query.getCount(connectedWallet)).count);
    setUpdating(false);
  };

  const onClickReset = async () => {
    setUpdating(true);
    await execute.reset(connectedWallet, 0);
    setCount((await query.getCount(connectedWallet)).count);
    setUpdating(false);
  };

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

  // Use Title and Wrapper like any other React component – except they're styled!
  return (
    <Wrapper>
      <div style={{ display: "inline" }}>
        COUNT: {count} {updating ? "(updating . . .)" : ""}
        <button onClick={onClickIncrement} type="button">
          {" "}
          +{" "}
        </button>
      </div>
    </Wrapper>
  );
};

export default SendPage;
