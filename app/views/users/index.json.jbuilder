json.array!(@users) do |user|
  json.extract! user, :id, :fname, :lname, :email, :password, :lat, :long, :address
  json.url user_url(user, format: :json)
end
