class UsersController < ApplicationController
    def create
        binding.pry
        user = User.create(user_params)
        if user.save
            render json: UsersSerializer.new(user)
        else
            render json: {message: 'error logging in'}
        end
    end

    def show
        user = User.find_by(username: params[:username])
        render json: UsersSerializer.new(user)
    end

    private
    def user_params
        params.require(:user).permit(:username, :email);
    end
end
