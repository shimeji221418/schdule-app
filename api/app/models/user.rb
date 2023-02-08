class User < ApplicationRecord
  belongs_to :team
  enum role: {general: 0, admin: 1}
end
