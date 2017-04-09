class ApplicationController < ActionController::Base
	include ApplicationHelper
	require 'signet/oauth_2/client'
	require 'json'
	require 'open-uri'
	protect_from_forgery with: :exception
	before_action :login, except: [:root, :oauth]
	helper_method :current_user, :logged_in?

	def oauth
		client_init
		@client.code = params['code']
		c = @client.fetch_access_token!
		url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=#{c['access_token']}"
		login_with JSON.parse open(url).read
		if session[:redirect].present?
			redirect_to session[:redirect]
		else
			redirect_to root_path
		end
	end

	def root
		if logged_in?
			redirect_to levels_path
		else
			render file: "content/main", layout: false
		end
	end

	private

	def login
		unless logged_in?
			session[:redirect] = request.original_url
			client_init
			redirect_to(@client.authorization_uri.to_s)
		end
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
			# Client info from Google API console
			:client_id => '831933960744-ltmis3dsek2sn9727ndfmik9fuklg3a4.apps.googleusercontent.com',
			:project_id => 'trubool-150412',
			:auth_provider_x509_cert_url => 'https://www.googleapis.com/oauth2/v1/certs',
			:client_secret => 'sYtRDzWlgUKWNNTlaZjyatsl'
		)
	end
end
