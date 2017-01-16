class CreateLevels < ActiveRecord::Migration[5.0]
  def change
    create_table :levels do |t|
      t.references :user, limit: 16, foreign_key: true
      t.string :inputs
      t.string :outputs
      t.string :pieces
      t.integer :width
      t.integer :height
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
