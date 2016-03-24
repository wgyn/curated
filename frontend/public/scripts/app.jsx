var React = require('react')
var ReactDOM = require('react-dom')
var {Link, Route, Router, browserHistory} = require('react-router')
var $ = require('jquery')

var ListOfLists = require('./list_of_lists.jsx')
var Navbar = require('./navbar.jsx')
var ReadingListContainer = require('./views.jsx')

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Navbar/>

        <div className="ui main text container">
          {this.props.children}
        </div>
      </div>
    )
  }
});

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/lists" component={ListOfLists} />
      <Route path="/lists/:id" component={ReadingListContainer} />
    </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('app'));
