class UsersController < ApplicationController
# uuse reference below to set up gem geocoder and gmaps4rails
# https://github.com/JonKernPA/gmaps
  def index
    @users = User.find('3')
    @hash = Gmaps4rails.build_markers(@users) do |user, marker|
      marker.lat user.latitude
      marker.lng user.longitude
      # marker.title user.title
    end
  end


  # before_action :set_user, only: [:show, :edit, :update, :destroy]
  # @client = GooglePlaces::Client.new(API_KEY)
  # client is a method off of the google places gem
  # were just creating a new client from the google places gem
  # and using our API_key

  # GET /users
  # GET /users.json
  # def index
  #   @client.spots(-33.8670522, 151.1957362, :types => 'restaurant')
  #   @users = User.all
  # end

  # GET /users/1
  # GET /users/1.json
  # def show
  # end

  # GET /users/new
  # def new
  #   @user = User.new
  # end

  # GET /users/1/edit
  # def edit
  # end

  # POST /users
  # POST /users.json
  # def create
  #   @user = User.new(user_params)

  #   respond_to do |format|
  #     if @user.save
  #       format.html { redirect_to @user, notice: 'User was successfully created.' }
  #       format.json { render :show, status: :created, location: @user }
  #     else
  #       format.html { render :new }
  #       format.json { render json: @user.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  # def update
  #   respond_to do |format|
  #     if @user.update(user_params)
  #       format.html { redirect_to @user, notice: 'User was successfully updated.' }
  #       format.json { render :show, status: :ok, location: @user }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @user.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # DELETE /users/1
  # DELETE /users/1.json
  # def destroy
  #   @user.destroy
  #   respond_to do |format|
  #     format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
  #     format.json { head :no_content }
  #   end
  # end

  # private
    # Use callbacks to share common setup or constraints between actions.
    # def set_user
    #   @user = User.find(params[:id])
    # end

    # Never trust parameters from the scary internet, only allow the white list through.
    # def user_params
    #   params.require(:user).permit(:fname, :lname, :email, :password, :lat, :long, :address)
    # end
end
