require 'yelp'
require 'json'
require 'pry'

class WelcomeController < ApplicationController

	@@yelp_client = Yelp::Client.new({ consumer_key: ENV["YELP_CONSUMER_KEY"],
                            consumer_secret: ENV["YELP_CONSUMER_SECRET"],
                            token: ENV["YELP_TOKEN"],
                            token_secret: ENV["YELP_TOKEN_SECRET"]
                          })

	def index
		yelp_raw = @@yelp_client.search('San Francisco', { term: 'Starbucks', radius_filter: 50, limit: 3 })
		@result = yelp_raw.businesses
	end
end
