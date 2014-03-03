namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    make_graph
  end
  def make_graph
    m = Metagraph.new
    5.times do
      v = m.vertices.new
      v.name = "#{('a'..'z').to_a.sample}#{(1..9).to_a.sample}"
      v.save!
    end
    5.times do |num|
      e = m.edges.new
      e.name = "e#{num}"
      e.save!
    end
    ids = []
    m.vertices.all.each do |v|
      ids << v.id
    end
    m.edges.each do |e|
      from = ids.sample
      to = ids.sample
      if from != to
        e.from = from
        e.to = to
      else
        e.from = from % 3 + 1
        e.to = to % 2 + 1
      end
      e.save!
    end
    m.save!
  end

end
