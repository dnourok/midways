class ChangeColumnName < ActiveRecord::Migration
  def change
  	rename_column :users, :long, :longitude
  end
end
