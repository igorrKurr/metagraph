class MetagraphsController < ApplicationController
  
  def index
    @metagraphs = Metagraph.all
  end

  def new
    @metagraph = Metagraph.new
    @metagraph.metavertices.build
    #@metagraph.metavertices.vertices.build
    @metagraph.edges.build

  end

  def create
    @metagraph = Metagraph.new
    if @metagraph.save
      redirect_to @metagraph
    else
      render 'new'
    end
  end

  def show
    @@metagraph = Metagraph.find(params[:id])
    @metagraph = @@metagraph
    
  end

  def json 
    render json: @@metagraph.get_json
  end
end
