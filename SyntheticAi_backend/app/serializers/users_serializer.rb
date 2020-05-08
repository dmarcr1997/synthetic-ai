class UsersSerializer
  include FastJsonapi::ObjectSerializer
  attributes :username, :email, :brains
end
