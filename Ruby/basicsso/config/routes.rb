Rails.application.routes.draw do
  root to: 'account#index'

  # oauth2
  get 'auth/azure_oauth2', as: :azure_auth
  match 'auth/azure_oauth2/callback', to: 'account#azure_oauth2_callback', via: [:get, :post]

  # account
  get 'account/index'
  get 'account/login'
  post 'account/login_o365'
  match 'account/logoff', via: [:get, :post]

end