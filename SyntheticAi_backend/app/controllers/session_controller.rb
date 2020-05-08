class SessionController < ApplicationController
    def create
        user = User.find_by(email: session_params[:email])
        if user
            render json: UserSerializer.new(user)
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
        params.require(:user).permit(:email, :password)
    end
end
