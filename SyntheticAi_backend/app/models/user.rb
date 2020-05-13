class User < ApplicationRecord
    # has_secure_password
    has_many :brains
    validates :user_name, uniqueness: true
end
