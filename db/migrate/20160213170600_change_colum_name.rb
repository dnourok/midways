class ChangeColumName < ActiveRecord::Migration
  def change
  	rename_column :users, :long, :longitude
  	rename_column :users, :lat, :latitude
  end
end
