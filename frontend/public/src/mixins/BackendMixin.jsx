// TODO: Distinguish between dev / prod environments
var BackendMixin = {
  baseURL: function() {
    return 'http://localhost:4567'
  }
};

module.exports = BackendMixin;
