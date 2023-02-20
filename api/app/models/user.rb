class User < ApplicationRecord
  belongs_to :team, dependent: :destroy
  has_many :schedules
  enum role: {general: 0, admin: 1}
  validates :name, uniqueness: true
  validates :email, uniqueness: true
end
