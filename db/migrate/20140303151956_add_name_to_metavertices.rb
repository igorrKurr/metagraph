class AddNameToMetavertices < ActiveRecord::Migration
  def change
    add_column :metavertices, :name, :string
  end
end
