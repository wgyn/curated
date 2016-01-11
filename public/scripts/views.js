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

  // @override
  getInitialState: function() {
    return {data: []};
  },

  // TODO: Set pollInterval on this
  componentDidMount: function() {
    this.loadData()
  },

  // @override
  render: function() {
    return (
      <div>
        // TODO: Figure out why this is stuck under the menu w/out br
        <br/><br/>
        <ReadingList data={this.state.data} />
        <BookForm onAddBook={this.handleAddBook} />
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
        <div className="ui list">
          {books.map(function(book){
            return(
              <Book title={book.title}
                    author={book.author}
                    key={book._id.$oid}>
              </Book>
            )
          })}
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
  render: function() {
    return (
      <div className="item">
        <i className="book icon"></i>
        <div className="content">
          <a className="header">{this.props.title}</a>
          <div className="description">
            <p>by {this.props.author}</p>
            <p>{this.props.description}</p>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <ReadingListContainer url="/lists/5691a1199cfe371cfa000000" />,
  document.getElementById('reading-list')
);
