class CreateUsers < ActiveRecord::Migration[5.0]
	def change
		create_table :users do |t|
			t.decimal :gid, precision: 32, scale: 0, index: true, null: false
			t.string :email, default: "", index: true, null: false
			t.string :given_name
			t.string :family_name
			t.string :link
			t.string :picture
			t.boolean :admin, default: false, null: false

			t.timestamps
		end
	end
end
