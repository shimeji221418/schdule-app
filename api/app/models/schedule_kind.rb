class ScheduleKind < ApplicationRecord
    has_many :schedules
    validates :name, uniqueness: true
    validates :color, uniqueness: true
end
