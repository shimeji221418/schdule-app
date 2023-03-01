import { Input, InputGroup, InputLeftAddon, Text } from "./index";
import React, { ChangeEvent, FC, memo } from "react";
import {
  DeepMap,
  FieldError,
  FieldValues,
  useFormContext,
} from "react-hook-form";

type Props = {
  title: string;
  type: string;
  value?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  message: string;
};

const InputForm: FC<Props> = memo((props) => {
  const { title, type, value, handleChange, message } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <InputGroup>
        <InputLeftAddon children={title} bg="cyan.600" color="white" />
        <Input
          value={value}
          {...register(`${title}`, {
            required: `${message}`,
            onChange: (e) => handleChange(e),
          })}
          id={title}
          name={title}
          placeholder={title}
          type={type}
        />
      </InputGroup>
      {errors[title] && (
        <Text>{`${
          (errors[title] as DeepMap<FieldValues, FieldError>).message
        }`}</Text>
      )}
    </>
  );
});

export default InputForm;
