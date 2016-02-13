class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  @@client = GooglePlaces::Client.new(ENV['GOOGLE_API_PLACES_KEY'])
  # client is a method off of the google places gem
  # were just creating a new client from the google places gem
  # and using our API_key

  # GET /users
  # GET /users.json
  def index
    results = @@client.spots(-33.8670522, 151.1957362, :types => 'restaurant')
    @spots = results.flatten
    @italian = @@client.spots(-33.8670522, 151.1957362, :name => 'italian',  :types => 'restaurant')
    @french = @@client.spots(-33.8670522, 151.1957362, :name => 'french',  :types => 'restaurant')
    @mexican = @@client.spots(-33.8670522, 151.1957362, :name => 'mexican',  :types => 'restaurant')
    @indian = @@client.spots(-33.8670522, 151.1957362, :name => 'indian',  :types => 'restaurant')
    @japanese = @@client.spots(-33.8670522, 151.1957362, :name => 'japanese',  :types => 'restaurant')
    @pizza = @@client.spots(-33.8670522, 151.1957362, :name => 'pizza',  :types => 'restaurant')
    @thai = @@client.spots(-33.8670522, 151.1957362, :name => 'thai',  :types => 'restaurant')
    @american = @@client.spots(-33.8670522, 151.1957362, :name => 'american',  :types => 'restaurant')
    @chinese = @@client.spots(-33.8670522, 151.1957362, :name => 'chinese',  :types => 'restaurant')
    @hamburger = @@client.spots(-33.8670522, 151.1957362, :name => 'hamburger',  :types => 'restaurant')
    @seafood = @@client.spots(-33.8670522, 151.1957362, :name => 'seafood',  :types => 'restaurant')
    @sushi = @@client.spots(-33.8670522, 151.1957362, :name => 'sushi',  :types => 'restaurant')
    @barbecue = @@client.spots(-33.8670522, 151.1957362, :name => 'barbecue',  :types => 'restaurant')
    @steak = @@client.spots(-33.8670522, 151.1957362, :name => 'steak',  :types => 'restaurant')

    # in order to get these to come up on the page you need to do a .each and then call by the variable.name
    # need to change the longitude and latitude here in these so that we can make it changable with inputs
    # we need to figure out if a budget is possible here

     @user = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:fname, :lname, :email, :password, :lat, :long, :address)
    end
end
