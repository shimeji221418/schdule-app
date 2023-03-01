import { Button } from "@chakra-ui/react";
import React, { FC, ReactNode, memo } from "react";

type Props = {
  children: ReactNode;
  type: "submit";
  color: string;
  size: string;
};

const FormButton: FC<Props> = memo((props) => {
  const { type, children, color, size } = props;
  return (
    <>
      <Button type={type} colorScheme={color} size={size}>
        {children}
      </Button>
    </>
  );
});

export default FormButton;
