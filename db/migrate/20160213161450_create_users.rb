class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :fname
      t.string :lname
      t.string :email
      t.string :password
      t.float :lat
      t.float :long
      t.string :address

      t.timestamps null: false
    end
  end
end
