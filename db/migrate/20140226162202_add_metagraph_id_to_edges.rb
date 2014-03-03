class AddMetagraphIdToEdges < ActiveRecord::Migration
  def change
    add_column :edges, :metagraph_id, :integer
  end
end
