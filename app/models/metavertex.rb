class Metavertex < ActiveRecord::Base
  belongs_to :metagraph
  has_many :vertices

  accepts_nested_attributes_for :vertices

  def verts
    verts = []
    self.vertices.each do |v|
      verts << v.name
    end
    
    verts
  end
end
