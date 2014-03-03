class CreateEdges < ActiveRecord::Migration
  def change
    create_table :edges do |t|
      t.string :name

      t.timestamps
    end
  end
end
