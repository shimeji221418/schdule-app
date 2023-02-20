FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "sugiyama#{n}" }
    sequence(:email) { |n| "tester#{n}@example.com" }
    sequence(:uid) { |n| "sugiyama#{n}" }
    role {1}
    association :team
  end
end
