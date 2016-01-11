require 'json'
require 'mongoid'
require 'sinatra'

require 'sinatra/reloader' if development?

configure do
  Mongoid.load!('mongoid.yaml')
end

module Model
  # TOO: Would be cool to append tokens like with Chalk::ODM
  class Book
    include Mongoid::Document
    include Mongoid::Timestamps

    field :title, type: String
    field :author, type: String
  end

  class ReadingList
    include Mongoid::Document
    include Mongoid::Timestamps

    field :name, type: String
    field :description, type: String
    has_and_belongs_to_many :books, inverse_of: nil
  end
end

get '/' do
  erb :index, :format => :html5
end

post '/lists' do
  Model::ReadingList.create!(
    name=params[:name],
    description=params[:description],
  )
end

get '/lists' do
  rls = Model::ReadingList.all
  # TODO: Wrap in HTML
  rls.map{|rl| [rl.name, rl.description]}
end

list_handler = lambda do
  id_or_name = params[:list]
  http_method = request.env['REQUEST_METHOD']

  rl ||= Model::ReadingList.find(id_or_name)
  rl ||= Model::ReadingList.find_by(name: id_or_name)

  if rl
    case http_method
    when 'POST'
      book = Model::Book.create!(
        title: params[:title],
        author: params[:author],
      )
      rl.books.push(book)
    when 'DELETE'
      # TODO: Include book-id in the div...
      # TODO: Actually call this endpoint
      1
    end
    rl.as_json(methods: [:books]).to_json
  else
    # TODO: Raise 404 or something...
    JSON.generate({})
  end
end
get '/lists/:list', &list_handler
post '/lists/:list', &list_handler
delete '/lists/:list', &list_handler
