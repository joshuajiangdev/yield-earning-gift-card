import styled from "@emotion/styled";

const OutterWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const InnerWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
`;

export const AppWrapper: React.FC = ({ children }) => {
  return (
    <OutterWrapper>
      <InnerWrapper>{children}</InnerWrapper>
    </OutterWrapper>
  );
};
