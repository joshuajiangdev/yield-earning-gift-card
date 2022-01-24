import { useConnectedWallet } from "@terra-money/wallet-provider";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import * as query from "../src/contract/query";

const ReceivePage: NextPage = () => {
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

  const connectedWallet = useConnectedWallet();
  console.log("connected wallet: ", connectedWallet);
  const [msg, setMessage] = useState<string>();
  const [updating, setUpdating] = useState(true);

  useEffect(() => {
    const prefetch = async () => {
      if (connectedWallet) {
        setMessage((await query.getGreeting(connectedWallet)).greeting);
      }
      setUpdating(false);
    };
    prefetch();
  }, [connectedWallet]);

  // Use Title and Wrapper like any other React component – except they're styled!
  return (
    <Wrapper>
      <Title>{msg}</Title>
    </Wrapper>
  );
};

export default ReceivePage;
