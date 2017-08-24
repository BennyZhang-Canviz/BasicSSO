class AccountController < ApplicationController
  
  def index
  end

  def login_o365
     redirect_to azure_auth_path
  end

  def azure_oauth2_callback
    auth = request.env['omniauth.auth']

    # cahce tokens
    token_service.cache_tokens(auth.info.oid, Constants::Resources::AADGraph, 
    auth.credentials.refresh_token, auth.credentials.token, auth.credentials.expires_at)
    set_o365_user(auth.info.email)

    self.azure_oauth2_logout_required = true
    redirect_to account_index_path
  end

  def logoff
    azure_oauth2_logout_required = self.azure_oauth2_logout_required 

    session.clear
    reset_session()
    clear_session_expire_after()

    if azure_oauth2_logout_required 
      post_logout_redirect_uri = URI.escape("#{full_host}/account/index", Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
      logoff_url = "#{Constants::AADInstance}common/oauth2/logout?post_logout_redirect_uri=#{post_logout_redirect_uri}"
      redirect_to logoff_url
    else
      redirect_to account_login_path 
    end   
  end

end