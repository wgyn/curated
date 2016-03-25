var React = require('react')
var {Link} = require('react-router')

var BackendMixin = require('./mixins/BackendMixin.jsx')

var ListOfLists = React.createClass({
  mixins: [BackendMixin],

  url: function() {
    return [this.baseURL(), '/lists'].join('/');
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

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadData()
  },

  render: function() {
    return (
      <div className="ui relaxed divided list animated">
        {this.state.data.map(function(obj) {
          return (
            <div className="item" key={obj._id.$oid}>
              <i className="large list middle aligned icon"></i>
              <div className="content">
                <Link to={"/lists/" + obj._id.$oid} className="header">
                  {obj.name}
                </Link>
                <div className="description">
                  {obj.description || "A generic reading list!"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )
  }
});

module.exports = ListOfLists;
