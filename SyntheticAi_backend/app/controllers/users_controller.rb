class UsersController < ApplicationController
    def create
        user = User.create(user_params)
        if user.save
            SessionsController.getSession[:user_id] = user.id
            render json: UsersSerializer.new(user)
        else
            render json: {message: 'Username already taken'}
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
