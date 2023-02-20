FactoryBot.define do
  factory :schedule do
    start_at { '2023-2-19 9:00'.in_time_zone }
    end_at { '2023-2-19 10:00'.in_time_zone }
    is_locked { false }
    description {'team meeting'}
    association :user
    association :schedule_kind
  end
end
