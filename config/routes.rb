Rails.application.routes.draw do
  resources :levels
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get "/old", to: "application#old"
end
