class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def old
      render file: "old/index", layout: false
  end
end
