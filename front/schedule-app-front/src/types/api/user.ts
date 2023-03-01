export type GetUserType = {
  id: number;
  name: string;
  email: string;
  uid: string;
  role: number;
  teamId: number;
  schedules?: [
    {
      start_at: Date;
      end_at: Date;
      is_locked: boolean;
      description: string;
      user_id: number;
      schedule_kind_id: number;
    }
  ];
};

export type LoginUserType = GetUserType | null;
