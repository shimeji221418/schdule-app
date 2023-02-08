import React, { ChangeEvent, FC, memo } from "react";

type Props = {
  title: string;
  type: string;
  value?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputForm: FC<Props> = memo((props) => {
  const { title, type, value, handleChange } = props;
  return (
    <>
      <div>
        <label htmlFor={title}>{title}: </label>
        <input
          id={title}
          name={title}
          placeholder={title}
          type={type}
          onChange={handleChange}
        />
      </div>
    </>
  );
});

export default InputForm;
