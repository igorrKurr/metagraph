class Edge < ActiveRecord::Base
  belongs_to :metagraph
  has_many :vertices
  has_many :metavertices
end
