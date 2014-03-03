class AddMetagraphIdToMetavertices < ActiveRecord::Migration
  def change
    add_column :metavertices, :metagraph_id, :integer
  end
end
