class MidwaysEmail < ApplicationMailer
	default from: "midways.midpointApp@gmail.com"

# Below is the email they recieve when they get an email from a friend
# with the midpoint location (resturant/bar) they are meeting

	def confirmation_email(info)
    @recipients_email = info["recipients_email"]
    @your_email = info["your_email"]
    mail(:to => @recipients_email, subject: "testing our emails", :cc => @your_email)
  end
end


# to: @confirmation_email.your_email, 