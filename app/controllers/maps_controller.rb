class MapsController < ApplicationController

	def index
		@maps_api_key = ENV["GOOGLE_API_MAPS_KEY"]
    render :index
  end

end
