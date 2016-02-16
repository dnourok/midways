class MidwaysEmail < ApplicationMailer
	default from: "midways.midpointApp@gmail.com"

# Below is the email they recieve when they get an email from a friend
# with the midpoint location (resturant/bar) they are meeting

	def decision_email(user)
    @user = user
    mail(to: @user.email, subject: 'Your friend #{} has picked a midpoint to meet at!')
  end
end
