class StaticController < ApplicationController
  def home
    @metagraphs = Metagraph.all
  end
end
