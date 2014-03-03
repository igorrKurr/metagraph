class AddMetagraphIdToVertexes < ActiveRecord::Migration
  def change
    add_column :vertices, :metagraph_id, :integer
  end
end
