class User < ApplicationRecord
    # has_secure_password
    has_many :brains
    validates_uniqueness_of :user_name
end
