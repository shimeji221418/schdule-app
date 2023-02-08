"use client";
import FormButton from "components/atoms/FormButton";
import InputForm from "components/atoms/InputForm";
import React, { FormEvent } from "react";

const SignUp = () => {
  const handleChange = () => {};
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };
  return (
    <>
      <div>SignUp</div>
      <form onSubmit={handleSubmit}>
        <InputForm title="name" type="text" handleChange={handleChange} />
        <InputForm title="email" type="text" handleChange={handleChange} />
        <InputForm title="team" type="text" handleChange={handleChange} />
        <InputForm
          title="password"
          type="password"
          handleChange={handleChange}
        />
        <FormButton type="submit">SignUp</FormButton>
      </form>
    </>
  );
};

export default SignUp;
