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

    def index
        user = User.find_by(id: params[:user_id]);
        brains = user.brains.where(brain_type: params[:brain_type]);
        if !brains.empty?
            render json: BrainsSerializer.new(brains)
        else
            render json: {message: "You have not made any brains in that category yet."}
        end
    end

    private
    def brain_params
        params.require(:brain).permit(:name, :brain_type, :brain_data, :id)
    end
end
