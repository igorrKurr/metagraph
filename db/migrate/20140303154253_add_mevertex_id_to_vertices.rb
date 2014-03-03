class AddMevertexIdToVertices < ActiveRecord::Migration
  def change
    add_column :vertices, :metavertex_id, :integer
  end
end
