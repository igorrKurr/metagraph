class Vertex < ActiveRecord::Base
  belongs_to :metagraph
  belongs_to :metavertices
end
