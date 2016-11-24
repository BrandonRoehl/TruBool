Rails.application.routes.draw do
  resources :levels
  resources :users, except: [:edit, :update, :delete, :create, :new]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "application#root"
  get "/oauth", to: "application#oauth", as: :oauth
end
