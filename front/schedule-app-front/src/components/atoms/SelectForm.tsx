import { TeamType } from "@/types/api/team";
import { Select, Text } from "@chakra-ui/react";
import React, { ChangeEvent, FC, memo, useState } from "react";
import {
  DeepMap,
  FieldError,
  FieldValues,
  useFormContext,
} from "react-hook-form";

type Props = {
  teams?: TeamType[];
  roles?: string[];
  title: string;
  name: string;
  handleonChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  message: string;
};

const SelectForm: FC<Props> = memo((props) => {
  const { teams, title, name, handleonChange, message, roles } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <Select
        {...register(`${name}`, {
          required: `${message}`,
          onChange: (e) => handleonChange(e),
        })}
        placeholder={title}
        name={name}
        onChange={(e) => handleonChange(e)}
      >
        {teams && (
          <>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </>
        )}
        {roles && (
          <>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </>
        )}
      </Select>
      {errors[name] && (
        <Text>{`${
          (errors[name] as DeepMap<FieldValues, FieldError>).message
        }`}</Text>
      )}
    </>
  );
});

export default SelectForm;
