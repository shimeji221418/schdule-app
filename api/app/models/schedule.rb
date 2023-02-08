class Schedule < ApplicationRecord
  belongs_to :user
  belongs_to :schedule_kind
end
