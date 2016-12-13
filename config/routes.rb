Rails.application.routes.draw do
  resources :levels do
      collection do
          get 'new/input', to: "levels#ajax_input"
      end
  end
  resources :users, except: [:edit, :update, :delete, :create, :new]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "application#root"
  get "/oauth", to: "application#oauth", as: :oauth


  get "/one", to: "levels#one"
  get "/two", to: "levels#two"
  get "/three", to: "levels#three"
  get "/four", to: "levels#four"
end
