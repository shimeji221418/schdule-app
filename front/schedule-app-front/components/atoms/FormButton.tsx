import React, { FC, ReactNode, memo } from "react";

type Props = {
  children: ReactNode;
  type: "submit";
};

const FormButton: FC<Props> = memo((props) => {
  const { type, children } = props;
  return (
    <>
      <div>
        <button type={type}>{children}</button>
      </div>
    </>
  );
});

export default FormButton;
