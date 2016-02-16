class ApplicationController < ActionController::Base
	
	# before_action do
 #      @gmap_api_key = ENV["GOOGLE_API_MAPS_KEY"]
 #  end 
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
end
