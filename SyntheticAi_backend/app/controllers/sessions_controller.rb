class SessionsController < ApplicationController
    def create
        # binding.pry
        user = User.find_by(username: session_params[:username])
        if user
            render json: UsersSerializer.new(user)
        else
            render json: {message: 'user could not be found'}
        end
    end

    def show
        render json: {homepage: 'Text of TExt with more text and then a little bit of text'}
    end


    def destroy
        render json: { message: 'You have been logged out come back again'}
    end

    private
    def session_params
        params.require(:session).permit(:username, :email)
    end
end
