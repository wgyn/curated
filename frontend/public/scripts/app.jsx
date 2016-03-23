var React = require('react')
var ReactDOM = require('react-dom')
var {Route, Router, hashHistory} = require('react-router')
var ReadingListContainer = require('./views.jsx')

var routes = (
  <Router history={hashHistory}>
    <Route path="/" component={ReadingListContainer}>
      <Route path="/lists/:id" component={ReadingListContainer} />
    </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('app'));
