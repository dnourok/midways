class ConfirmationEmailsController < ApplicationController
	before_action :set_confirmation_email, only: [:show, :edit, :update, :destroy]

	def index
		@confirmation_emails = ConfirmationEmail.all
	end

  def new
    @confirmation_email = ConfirmationEmail.new
    @address = params["address"]
    @name = params["name"]
    binding.pry
  end

	def show

	end

	def create
		@confirmation_email = ConfirmationEmail.new(confirmation_email_params)

			respond_to do |format|
				if @confirmation_email.save
						MidwaysEmail.confirmation_email(@confirmation_email).deliver
					format.html { redirect_to @confirmation_email, notice: 'User was successfully created.' }
  				format.json { render :show, status: :created, location: @confirmation_email }
				else
  				format.html { render :new }
  				format.json { render json: @confirmation_email.errors, status: :unprocessable_entity }
				end
			end
	end

	def update
  	respond_to do |format|
      if @confirmation_email.update(confirmation_email_params)
        format.html { redirect_to @confirmation_email, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @confirmation_email }
      else
        format.html { render :edit }
        format.json { render json: @confirmation_email.errors, status: :unprocessable_entity }
      end
    end
  end

		def destroy
	    @confirmation_email.destroy
	    respond_to do |format|
	      format.html { redirect_to confirmation_emails_url, notice: 'User was successfully destroyed.' }
	      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_confirmation_email
      @confirmation_email = ConfirmationEmail.find(params[:id])
    end
    # Never trust parameters from the scary internet, only allow the white list through.
    def confirmation_email_params
      params.require(:confirmation_email).permit(:your_name, :your_email, :recipients_name, :recipients_email)
    end
end


