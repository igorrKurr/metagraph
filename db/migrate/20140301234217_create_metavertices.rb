class CreateMetavertices < ActiveRecord::Migration
  def change
    create_table :metavertices do |t|

      t.timestamps
    end
  end
end
