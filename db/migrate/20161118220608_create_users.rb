class CreateUsers < ActiveRecord::Migration[5.0]
    def change
        create_table :users, id: false do |t|
            t.decimal :id, precision: 32, scale: 0, primary_key: true
            t.string :email
            t.string :given_name
            t.string :family_name
            t.string :link
            t.string :picture

            t.timestamps
        end
    end
end
