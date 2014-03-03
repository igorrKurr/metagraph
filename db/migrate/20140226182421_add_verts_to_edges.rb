class AddVertsToEdges < ActiveRecord::Migration
  def change
    add_column :edges, :from, :integer
    add_column :edges, :to, :integer
  end
end
