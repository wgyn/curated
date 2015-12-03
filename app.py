import json
from flask import g, Flask, Response, request, url_for
from mongoengine import connect

from models import User, Book, ReadingList

app = Flask(__name__, static_url_path='', static_folder='public')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

@app.before_request
def before_request():
    # TODO: Authenticate user and retrieve User object
    g.user = User.objects[0]
    # TODO: Support more than one List
    g.reading_list = ReadingList.objects[0]


@app.route("/lists", methods=['GET', 'POST'])
def trips():
    if request.method == 'POST':
        rl = ReadingList(
            name=request.form['name'],
            created_by=g.user,
            description=request.form['description'],
        )
        rl.save()

    return Response(ReadingList.objects.to_json(),
                    mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})


@app.route('/lists/<list_id>', methods=['GET'])
def trip(list_id):
    try:
        rl = ReadingList.objects(id=list_id).first()
    except:
        rl = None

    if rl == None:
        return Response('List ' + list_id + ' not found!', status=404)

    return Response(rl.to_json(),
                    mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})


@app.route("/lists/<list_id>/books", methods=['GET', 'POST', 'DELETE'])
def books(list_id):
    if request.method == 'POST':
        book = Book(
            title=request.form.get('title'),
            author=request.form.get('author'),
            buy_link=request.form.get('buy_link'),
        )
        book.save()
    elif request.method == 'DELETE':
        raise NotImplementedError

    return Response(Book.objects.to_json(),
                    mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})


if __name__ == "__main__":
    connect('readinglist')
    app.run(debug=True)
