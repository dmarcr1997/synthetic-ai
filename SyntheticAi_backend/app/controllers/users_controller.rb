class UsersController < ApplicationController
    def create
        user = User.create(user_params)
        if user.save
            render json: UserSerializer.new(user)
        else
            render json: {message: 'error logging in'}
        end
    end

    def show
        user = user.find(params[:id])
        render json: UserSerializer.new(user)
    end

    private

    def user_param
        params.require(:user).permit(:username, email, password)
    end
end
