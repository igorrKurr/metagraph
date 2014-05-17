class Metagraph < ActiveRecord::Base

  has_many :edges
  has_many :vertices
  has_many :metavertices

  accepts_nested_attributes_for :metavertices, :edges

  def find_vertex(id)
    self.vertices.find(id)
  end

  def find_metavertex(id)
    self.metavertices.find(id)
  end

  def adj_list
    list_hash = {}

    self.edges.each do |e|
      list_hash["#{find_metavertex(e.from).name}"] = []
    end

    self.edges.each do |e|
      list_hash["#{find_metavertex(e.from).name}"] << "#{find_metavertex(e.to).name}"
    end

    list_hash
  end

  def intersections
    
  end

  def get_json

    list = []

    vertices = []
    self.metavertices.each do |v|
      vertices << {"name" => v.name, "vertices" => v.vertices.inject([]){|verts, el| verts << el.name}}
    end
    self.adj_list().each do |k,v|
      list << {"parent" => k, "children" => v}
    end
    response = {"vertices" => vertices, "adjList" => list}
    response.to_json
  end
end
