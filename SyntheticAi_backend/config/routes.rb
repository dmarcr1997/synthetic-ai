Rails.application.routes.draw do
  post 'users/new', to: 'users#create'
  resources :users, only: [ :show] do
    post 'brains', to: 'brains#index'
    post 'brains/new', to: 'brains#create'
    post 'brains/:id/edit', to: 'brains#edit'
  end
  resources :sessions, only: [:index, :create]
  get 'sessions/destroy', to: 'sessions#destroy'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
