class CreateConfirmationEmails < ActiveRecord::Migration
  def change
    create_table :confirmation_emails do |t|
      t.string :your_name
      t.string :your_email
      t.string :recipients_name
      t.string :recipients_email
      t.string :google_url

      t.timestamps null: false
    end
  end
end
