FactoryBot.define do
  factory :schedule_kind do
    sequence(:name){ |n|"meeting#{n}" }
    sequence(:color){ |n|"red#{n}" }
  end
end
