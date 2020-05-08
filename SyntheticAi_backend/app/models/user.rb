class User < ApplicationRecord
    # has_secure_password
    has_many :brains
end
