module.exports = {
  entry: "./public/scripts/app.jsx",
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
