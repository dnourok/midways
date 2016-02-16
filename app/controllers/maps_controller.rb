class MapsController < ApplicationController
	skip_before_action :verify_authenticity_token

  @@client = GooglePlaces::Client.new(ENV['GOOGLE_API_MAPS_KEY'])
  # client is a method off of the google places gem
  # were just creating a new client from the google places gem
  # and using our API_key

	def index
		@maps_api_key = ENV["GOOGLE_API_MAPS_KEY"]
    render :index
  end

  def create
  	lat = params["destinationLat"].to_f
  	lng = params["destinationLng"].to_f
  	@aStart = params["aStart"]
  	@bStart = params["bStart"]
  	# binding.pry
  	# get info from google places
  	@results = @@client.spots(lat, lng, :radius => 200, :keyword => 'italian', :types => 'restaurant')
  	# binding.pry
  	# @name = "peter"
  	# @spots = results.flatten
  	# put it in a variable

  	render :create
  end

end
