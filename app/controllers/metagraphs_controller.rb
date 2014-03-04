class MetagraphsController < ApplicationController
  
  def index
    @metagraphs = Metagraph.all
  end

  def new


    @metagraph = Metagraph.new
    metavertex = @metagraph.metavertices.build
    metavertex.vertices.build
    @metagraph.edges.build

  end

  def create
    @metagraph = Metagraph.new(metagraph_params)
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

private
  
  def metagraph_params
    params.require(:metagraph).permit(:metavertices_attributes => [:id, :_destroy, :name, :vertices_attributes => [:id, :_destroy, :name]], 
      :edges_attributes => [:id, :_destroy, :name, :from, :to] )
  end
end
