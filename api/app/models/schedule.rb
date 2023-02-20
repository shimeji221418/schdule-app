class Schedule < ApplicationRecord
  belongs_to :user, dependent: :destroy
  belongs_to :schedule_kind, dependent: :destroy
end
