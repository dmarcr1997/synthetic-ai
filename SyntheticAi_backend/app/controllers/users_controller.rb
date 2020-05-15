class UsersController < ApplicationController
    include AuthTokenConcern
    
    def create
        user = User.create(user_params, auth_token: unique_auth_token)
        if user.save
            session[:user_id] = user.id
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
