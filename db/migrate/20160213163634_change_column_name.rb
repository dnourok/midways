class ChangeColumnName < ActiveRecord::Migration
  def change
  	rename_column :users, :lat, :latitude
  end
end
