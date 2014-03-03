class AddEdgeIdToVertices < ActiveRecord::Migration
  def change
    add_column :vertices, :edge_id, :integer
  end
end
