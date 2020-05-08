Rails.application.routes.draw do
  
  resources :users, only: [:create, :show] do
    resources :brains, only: [:show, :create, :index, :edit]
  end
  resources :sessions, only: [:show, :create, :destroy]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
