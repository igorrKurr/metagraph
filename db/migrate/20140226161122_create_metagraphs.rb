class CreateMetagraphs < ActiveRecord::Migration
  def change
    create_table :metagraphs do |t|

      t.timestamps
    end
  end
end
