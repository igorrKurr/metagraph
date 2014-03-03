namespace :db do
  desc "Fill database with sample data"
  task metaverts: :environment do
    make_graph
    make_graph2
  end

  def make_graph
    m = Metagraph.new
    mv1 = m.metavertices.new
    mv1.name = "mv1"
    v1 = mv1.vertices.new
    v1.name = "v1"
    v1.save!
    v2 = mv1.vertices.new
    v2.name = "v2"
    v2.save!
    mv1.save!

    mv2 = m.metavertices.new
    mv2.name = "mv2"
    v3 = mv2.vertices.new
    v3.name = "v3"
    v3.save!
    mv2.save!

    mv3 = m.metavertices.new
    mv3.name = "mv3"
    v4 = mv3.vertices.new
    v4.name = "v4"
    v4.save!
    v5 = mv3.vertices.new
    v5.name = "v5"
    v5.save!
    mv3.save!

    mv4 = m.metavertices.new
    mv4.name = "mv4"
    v6 = mv4.vertices.new
    v6.name = "v6"
    v6.save!
    mv4.save!

    e1 = m.edges.new
    e1.name = "e1"
    e1.from = mv1.id
    e1.to = mv2.id
    e1.save!

    e2 = m.edges.new
    e2.name = "e2"
    e2.from = mv1.id
    e2.to = mv3.id
    e2.save!

    e3 = m.edges.new
    e3.name = "e3"
    e3.from = mv2.id
    e3.to = mv4.id
    e3.save!

    m.save!
  end

  def make_graph2
    m = Metagraph.new
    mv1 = m.metavertices.new
    mv1.name = "mv1"
    v1 = mv1.vertices.new
    v1.name = "v1"
    v1.save!
    v2 = mv1.vertices.new
    v2.name = "v2"
    v2.save!
    mv1.save!

    mv2 = m.metavertices.new
    mv2.name = "mv2"
    v3 = mv2.vertices.new
    v3.name = "v3"
    v3.save!
    mv2.save!

    mv3 = m.metavertices.new
    mv3.name = "mv3"
    v4 = mv3.vertices.new
    v4.name = "v4"
    v4.save!
    v5 = mv3.vertices.new
    v5.name = "v5"
    v5.save!
    mv3.save!

    mv4 = m.metavertices.new
    mv4.name = "mv4"
    v6 = mv4.vertices.new
    v6.name = "v6"
    v6.save!
    mv4.save!

    e1 = m.edges.new
    e1.name = "e1"
    e1.from = mv1.id
    e1.to = mv2.id
    e1.save!

    e2 = m.edges.new
    e2.name = "e2"
    e2.from = mv1.id
    e2.to = mv4.id
    e2.save!

    e3 = m.edges.new
    e3.name = "e3"
    e3.from = mv4.id
    e3.to = mv3.id
    e3.save!

    m.save!
  end

end
