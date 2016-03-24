Backend
-------
`cd backend`

First time, install dependencies (which are managed by bundler).
- `bundle install`

To run locally:
- Start a local mongod: `sudo mongod`
- Start the sinatra applicaion: `bundle exec ruby app.rb`

Frontend
--------
`cd frontend`

First time, install dependencies (which are managed by bower).
- `npm install -g bower`
- `bower install`

To run locally:
- `npm start` (managed by webpack)
