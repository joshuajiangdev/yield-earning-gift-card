import type { NextPage } from "next";
import styled from "styled-components";

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

  // Use Title and Wrapper like any other React component – except they're styled!
  return (
    <Wrapper>
      <Title>Recieve page</Title>
    </Wrapper>
  );
};

export default ReceivePage;
