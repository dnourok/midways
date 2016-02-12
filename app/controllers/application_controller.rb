class ApplicationController < ActionController::Base
  before_action do
  	@gmap_api_key = ENV['GOOGLE_MAPS_API_KEY']
  	@gplaces_api_key = ENV['GOOGLE_PLACES_API_KEY']
  end	
  protect_from_forgery with: :exception
end