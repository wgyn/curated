var ReadingListContainer = React.createClass({
  loadData: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  handleAddBook: function(book) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: book,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  handleRemoveBook: function(book) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'DELETE',
      data: book,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // @override
  getInitialState: function() {
    return {data: []};
  },

  // TODO: Set pollInterval on this
  componentDidMount: function() {
    this.loadData()

    // Initialize accordion for the list
    $('.ui.accordion').accordion()
  },

  // @override
  render: function() {
    return (
      <div>
        // TODO: Figure out why this is stuck under the menu w/out br
        <br/><br/>
        <ReadingList data={this.state.data}
                     onRemoveBook={this.handleRemoveBook} />
        <br/>
        <BookForm onAddBook={this.handleAddBook} />
        <SearchBookForm />
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
        <div className="ui accordion">
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

var BookForm = React.createClass({
  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },

  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var author = this.state.author.trim();
    if (!title) {
      // TODO: Alert
      return;
    }
    this.props.onAddBook({title: title, author: author});
    this.setState({title: '', author: ''});
  },

  // @override
  getInitialState: function() {
    return {title: '', author: ''}
  },

  // @override
  render: function() {
    return (
      <form className="ui form" onSubmit={this.handleSubmit}>
        <h3 className="ui dividing header">Add a book</h3>
        <div className="field">
          <label>Title</label>
          <input type="text" placeholder="Green Eggs and Ham"
                 value={this.state.title}
                 onChange={this.handleTitleChange} />
        </div>
        <div className="field">
          <label>Author</label>
          <input type="text" placeholder="Dr. Seuss"
                 value={this.state.author}
                 onChange={this.handleAuthorChange} />
        </div>
        <button className="ui button" type="submit">Add</button>
      </form>
    );
  },
});

var Book = React.createClass({
  handleDelete: function(e) {
    e.preventDefault();
    this.props.onRemoveBook({
      book_id: this.props.bookId,
    });
  },

  // @override
  render: function() {
    return (
      <div>
        <div className="title">
          <i className="dropdown icon"></i>
          {this.props.title} by {this.props.author}
        </div>
        <div className="content">
          <div className="transition hidden">
            <p>Generic description!</p>
            <button className="ui button">
              <i className="trash icon" onClick={this.handleDelete}></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
});

var SearchBookForm = React.createClass({
  // @override
  componentDidMount: function() {
    $('.ui.search').search({
      apiSettings: {
        url: '/search/?q={query}',
        searchDelay: 1000,
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
            });
          });
          return response;
        },
        onChange: function(response) {
          this.setState({response});
        },
      },
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
    return (
      <div className="ui fluid search">
        <div className="ui icon input fluid">
          <input className="prompt" type="text"
                 placeholder="Search by title and/or author..." />
          <i className="search icon"></i>
        </div>
        <div className="results"></div>
      </div>
    );
  },
})

ReactDOM.render(
  <ReadingListContainer url="/lists/5691a1199cfe371cfa000000" />,
  document.getElementById('reading-list')
);
