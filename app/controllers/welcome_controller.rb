require 'yelp'
require 'json'
require 'pry'
# require 'httparty'

class WelcomeController < ApplicationController

	# response = HTTParty.get('')

	@@yelp_client = Yelp::Client.new({ consumer_key: ENV["YELP_CONSUMER_KEY"],
                                  consumer_secret: ENV["YELP_CONSUMER_SECRET"],
                                            token: ENV["YELP_TOKEN"],
                                     token_secret: ENV["YELP_TOKEN_SECRET"]
                         					 })

	def index
		coordinates = {latitude: 40.720125, longitude: -74.001656}
		params = { term: 'cafe', radius_filter: 300, limit: 3 }
		yelp_raw = @@yelp_client.search_by_coordinates(coordinates, params)
		# binding.pry
		@result = yelp_raw.businesses
	end
end
