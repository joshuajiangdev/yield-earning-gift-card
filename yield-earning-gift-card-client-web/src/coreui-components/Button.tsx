import { FC, DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { GeneralSize } from "../constants/design";

type ButtonProps = {
  size?: GeneralSize;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: FC<ButtonProps> = ({
  children,
  size = GeneralSize.medium,
  ...props
}) => {
  return <button {...props}>{children}</button>;
};

export { Button };
