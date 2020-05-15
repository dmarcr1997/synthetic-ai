class SessionsController < ApplicationController
    include AuthTokenConcern
    @@Sessions = {}
    def create
        # binding.pry
        user = User.find_by(username: session_params[:username])
        if user
            @@Sessions[:user_id] = user.id
            render json: UsersSerializer.new(user)
        else
            render json: {message: 'user could not be found'}
        end
    end

    def self.getSess
        @@Sessions
    end

    def index
        if @@Sessions[:user_id]
            user = User.find_by(id: @@Sessions[:user_id])
            render json: UsersSerializer.new(user)
        else
            render json: {noCurrentUser: 'null'}
        end
    end

    def destroy
        @@Sessions.delete(:user_id);
        render json: { message: 'You have been logged out come back again'}
    end

    private
    def session_params
        params.require(:session).permit(:username, :email)
    end
end
