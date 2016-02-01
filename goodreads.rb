require 'mongoid'
require 'nokogiri'
require 'rest-client'
require 'uri'

module Goodreads
  API_BASE = 'https://www.goodreads.com/search/index.xml'

  class Work
    include Mongoid::Document

    field :id, type: Integer
    field :publication_year, type: Integer, default: nil
    field :publication_month, type: Integer, default: nil
    field :publication_day, type: Integer, default: nil
    field :book_id, type: Integer
    field :book_title, type: String
    field :author_id, type: Integer
    field :author_name, type: String
  end

  class Client
    attr_accessor :api_key

    def initialize(api_key)
      @api_key = api_key
      @base_url = "#{API_BASE}?key=#{@api_key}"
    end

    # See: https://www.goodreads.com/api/index#search.books
    def search_books(q)
      url = URI.escape("#{@base_url}&q=#{q}")
      response = RestClient.get(url)
      doc = Nokogiri.XML(response) do |config|
        config.strict.nonet
      end
      works = doc.xpath('//search//results//work')
      works.map do |w|
        Work.new(
          id: w.at('id').content,
          publication_year: w.at('original_publication_year').content,
          publication_month: w.at('original_publication_month').content,
          publication_day: w.at('original_publication_day').content,
          book_id: w.at('best_book').at('id').content,
          book_title: w.at('best_book').at('title').content,
          author_id: w.at('author').at('id').content,
          author_name: w.at('author').at('name').content,
        )
      end
    end
  end
end
