var React = require('react')
var ReactDOM = require('react-dom')
var {Route, Router, browserHistory} = require('react-router')
var ReadingListContainer = require('./views.jsx')

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={ReadingListContainer} />
    <Route path="/lists/:id" component={ReadingListContainer} />
  </Router>
);

ReactDOM.render(routes, document.getElementById('app'));
