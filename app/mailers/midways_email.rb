class MidwaysEmail < ApplicationMailer
	default from: "midways.midpointApp@gmail.com"

# Below is the email they recieve when they get an email from a friend
# with the midpoint location (resturant/bar) they are meeting

	def decision_email(confirmationEmail)
    @confirmation_email = confirmation_email
    mail(to: @confirmation_email.recipients_email, subject: 'Your friend #{:your_name} has picked a midpoint to meet at!')
  end
end


# to: @confirmation_email.your_email, 