export type NewUserType = {
  name: string;
  email: string;
  password: string;
  role: string;
  team_id: number;
};

export type LoginUserType = Pick<NewUserType, "email" | "password">;
