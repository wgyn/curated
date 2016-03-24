var React = require('react')
var {Link} = require('react-router')

var Navbar = React.createClass({
  render: function() {
    return (
      <div className="ui inverted menu">
        <div className="ui container">
          <a href="#" className="header item">
            <i className="world icon"></i>
            Curated
          </a>
          <Link to="/" className="item">Home</Link>
          <Link to="/lists" className="item">Reading Lists</Link>
        </div>
      </div>
    )
  }
});

module.exports = Navbar;
