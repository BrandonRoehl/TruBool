class ApplicationController < ActionController::Base
    require 'signet/oauth_2/client'
    protect_from_forgery with: :exception
    before_action :login, except: [:oauth]
    def login
        client_init
        redirect_to(@client.authorization_uri.to_s)
    end

    def oauth
        client_init
        @client.code = params['code']
        c = @client.fetch_access_token!
        raise c.inspect
    end

    def old
        render file: "old/index", layout: false
    end

    private

    def client_init
        @client = Signet::OAuth2::Client.new(
            :authorization_uri => 'https://accounts.google.com/o/oauth2/auth',
            :token_credential_uri =>  'https://www.googleapis.com/oauth2/v3/token',
            :redirect_uri => 'http://localhost:3000/oauth',
            :scope => 'email profile',

            :client_id => '831933960744-ltmis3dsek2sn9727ndfmik9fuklg3a4.apps.googleusercontent.com',
            :project_id => 'trubool-150412',
            :auth_provider_x509_cert_url => 'https://www.googleapis.com/oauth2/v1/certs',
            :client_secret => 'sYtRDzWlgUKWNNTlaZjyatsl'
        )
    end
end
