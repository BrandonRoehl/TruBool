class ApplicationController < ActionController::Base
    include ApplicationHelper
    require 'signet/oauth_2/client'
    require 'json'
    require 'open-uri'
    protect_from_forgery with: :exception
    before_action :redirect_to_root, except: [:root, :login]
    helper_method :current_user, :logged_in?

    def login
        unless logged_in?
            client_init
            redirect_to(@client.authorization_uri.to_s)
        else
            redirect_to root_path
        end
    end

    def oauth
        client_init
        @client.code = params['code']
        c = @client.fetch_access_token!
        url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=#{c['access_token']}"
        login_with JSON.parse open(url).read
        redirect_to root_path
    end

    def root
        render file: "old/index", layout: false
    end

    private

    def redirect_to_root
        redirect_to root_path unless logged_in?
    end

    def login_with(info)
        @current_user = User.from_oauth info
        session[:user_id] = @current_user.id
    end

    def client_init
        @client = Signet::OAuth2::Client.new(
            :authorization_uri => 'https://accounts.google.com/o/oauth2/auth',
            :token_credential_uri =>  'https://www.googleapis.com/oauth2/v4/token',
            :redirect_uri => oauth_url,
            :scope => 'email profile',

            :client_id => '831933960744-ltmis3dsek2sn9727ndfmik9fuklg3a4.apps.googleusercontent.com',
            :project_id => 'trubool-150412',
            :auth_provider_x509_cert_url => 'https://www.googleapis.com/oauth2/v1/certs',
            :client_secret => 'sYtRDzWlgUKWNNTlaZjyatsl'
        )
    end
end
