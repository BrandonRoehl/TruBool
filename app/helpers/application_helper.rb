module ApplicationHelper
	# $user_id is for testing
	def logged_in?
		return session[:user_id].present? || $user_id.present?
	end

	def current_user
		if logged_in?
			return @current_user ||= User.find(session[:user_id] || $user_id)
		else
			return nil
		end
	end
end
