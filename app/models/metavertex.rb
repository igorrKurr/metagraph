class Metavertex < ActiveRecord::Base
  belongs_to :metagraph
  has_many :vertices

  accepts_nested_attributes_for :vertices
end
