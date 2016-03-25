var React = require('react')
var ReactDOM = require('react-dom')

var BackendMixin = require('./mixins/BackendMixin.jsx')

var ReadingListContainer = React.createClass({
  mixins: [BackendMixin],

  url: function() {
    return [this.baseURL(), 'lists', this.props.params.id].join('/');
  },

  loadData: function() {
    $.ajax({
      url: this.url(),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.url(), status, err.toString());
      }.bind(this),
    });
  },

  handleAddBook: function(book) {
    $.ajax({
      url: this.url(),
      dataType: 'json',
      type: 'POST',
      data: book,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.url(), status, err.toString());
      }.bind(this),
    });
  },

  handleRemoveBook: function(book) {
    $.ajax({
      url: this.url(),
      dataType: 'json',
      type: 'DELETE',
      data: book,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.url(), status, err.toString());
      }.bind(this),
    });
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadData()
  },

  render: function() {
    return (
      <div>
        <ReadingList data={this.state.data}
                     onRemoveBook={this.handleRemoveBook} />
        <br/>
        <SearchBookForm onAddBook={this.handleAddBook} />
      </div>
    );
  },
});

var ReadingList = React.createClass({
  render: function() {
    var readinglist = this.props.data;
    // In initial render, readinglist will be an empty array
    var books = readinglist.books || [];
    return(
      // TODO: Include the list ID somewhere?
      <div>
        <h1>{readinglist.name}</h1>
        <div>
          {books.map(function(book){
            return(
              <Book title={book.title}
                    author={book.author}
                    bookId={book._id.$oid}
                    key={book._id.$oid}
                    onRemoveBook={this.props.onRemoveBook}>
              </Book>
            )
          }.bind(this))}
        </div>
      </div>
    )
  }
});

var Book = React.createClass({
  handleDelete: function(e) {
    e.preventDefault();
    this.props.onRemoveBook({
      book_id: this.props.bookId,
    });
  },

  // @override
  // TODO: Title/author would be nice as links. Maybe hoverable?!
  render: function() {
    return (
      <div className="ui fluid card">
        <div className="content">
          <div className="header">
            {this.props.title}
          </div>
          <div className="meta">
            {this.props.author}
          </div>
          <div className="description">
            <div className="right floated ui basic red button"
                 onClick={this.handleDelete}>
              <span><i className="trash icon"></i></span>
            </div>
            Generic description!
          </div>
        </div>
      </div>
    );
  }
});

var SearchBookForm = React.createClass({
  mixins: [BackendMixin],

  url: function() {
    // The {query} syntax is a semantic UI thing
    return [this.baseURL(), 'search/?q={query}'].join('/');
  },

  // @override
  componentDidMount: function() {
    $('.ui.search').search({
      apiSettings: {
        url: this.url(),
        searchDelay: 8000,
        /*
         * Make sure sure data is in the form expected by the search form
         * (handled by semantic-ui). See:
         * http://semantic-ui.com/modules/search.html#/examples.
         *
         * {
         *   "results": [
         *     {
         *       "title": "Green Eggs & Ham",
         *       "author": "Dr. Seuss",
         *     },
         *     ...
         *   ],
         * },
         */
        onResponse: function(backendResponse) {
          var response = {
            results: []
          };
          $.each(backendResponse, function(idx, item) {
            response.results.push({
              // These are magic keys used by semantic-ui
              title: item.book_title,
              description: item.author_name,
              // These are used to make internal requests
              author: item.author_name,
            });
          });
          return response;
        },
        onChange: function(response) {
          this.setState({response});
        },
      },
      onSelect: function(result, response) {
        // TODO: Set the Goodreads ID so we can link to these later
        this.props.onAddBook({
          title: result.title,
          author: result.author,
        });
      }.bind(this),
      maxResults: 5,
      minCharacters: 3,
    });
  },

  // @override
  componentDidUpdate: function() {
    $('.ui.search').dropdown('refresh')
  },

  // @override
  render: function() {
    $('.ui.search').search('set value', '')
    return (
      <div className="ui fluid search">
        <div className="ui icon input fluid">
          <input className="prompt" type="text"
                 placeholder="To add a book, search by title and/or author..." />
          <i className="search icon"></i>
        </div>
        <div className="results"></div>
      </div>
    );
  },
})

module.exports = ReadingListContainer;
