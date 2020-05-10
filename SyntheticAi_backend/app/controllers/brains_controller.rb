class BrainsController < ApplicationController
    def create
        user = User.find(params[:user_id])
        brain = Brain.create(brain_params)
        user.brains << brain
        if brain.save
            render json: BrainsSerializer.new(brain)
        else
            render json: {message: 'invalid entry'}
        end
    end

    def edit
        user = User.find(params[:user_id])
        brain = Brain.find(params[:id])
        brain.update(brain_params)
        brain.save
        if brain.save
            render json: BrainsSerializer.new(brain)
        else
            render json: {message: 'invalid entry'}
        end
    end

    private
    def brain_params
        params.require(:brain).permit(:name, :brain_type, :brain_data, :id)
    end
end
