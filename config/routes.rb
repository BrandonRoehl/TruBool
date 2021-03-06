Rails.application.routes.draw do
  resources :levels do
      collection do
          get 'new/input', to: "levels#ajax_input"
          get 'new/output', to: "levels#ajax_output"
      end
  end
  resources :users, except: [:edit, :update, :delete, :create, :new]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "application#root"
  get "/oauth", to: "application#oauth", as: :oauth
end
