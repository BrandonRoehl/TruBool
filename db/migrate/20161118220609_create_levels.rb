class CreateLevels < ActiveRecord::Migration[5.0]
	def change
		create_table :levels do |t|
			t.references :user, foreign_key: true
			t.string :JSONinputs, default: "[\"\"]", null: false
			t.string :JSONoutputs, default: "[\"\"]", null: false
			t.string :JSONpieces, default: "[\"\"]", null: false
			t.integer :width, default: 15, null: false
			t.integer :height, default: 10, null: false
			t.string :name, default: "", null: false, index: true
			t.text :description

			t.timestamps
		end
	end
end
