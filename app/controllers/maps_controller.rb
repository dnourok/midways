class MapsController < ApplicationController
	skip_before_action :verify_authenticity_token

	def index
		@maps_api_key = ENV["GOOGLE_API_MAPS_KEY"]
    render :index
  end

  def create
  	@aStart = params["aStart"]
  	@bStart = params["bStart"]
  	# get info from google places

  	# put it in a variable

  	render :create
  end

end
