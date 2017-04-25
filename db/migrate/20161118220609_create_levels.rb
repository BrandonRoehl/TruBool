class CreateLevels < ActiveRecord::Migration[5.0]
  def change
    create_table :levels do |t|
      t.references :user, foreign_key: true
      t.string :JSONinputs
      t.string :JSONoutputs
      t.string :JSONpieces
      t.integer :width
      t.integer :height
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
