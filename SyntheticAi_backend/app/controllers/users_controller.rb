class UsersController < ApplicationController
    def create
        binding.pry
        user = User.create(username: params["_json"])
        if user.save
            render json: UsersSerializer.new(user)
        else
            render json: {message: 'error logging in'}
        end
    end

    def show
        user = user.find(params[:id])
        render json: UserSerializer.new(user)
    end
end
