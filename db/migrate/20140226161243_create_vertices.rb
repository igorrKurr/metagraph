class CreateVertices < ActiveRecord::Migration
  def change
    create_table :vertices do |t|
      t.string :name
      t.string :value

      t.timestamps
    end
  end
end
