module.exports = {
  entry: "./public/src/App.jsx",
  output: {
    path: __dirname,
    filename: "./public/bundle.js",
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader' },
    ]
  }
}
