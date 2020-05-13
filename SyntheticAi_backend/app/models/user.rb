class User < ApplicationRecord
    # has_secure_password
    has_many :brains
    validates :username, uniqueness: true
end
