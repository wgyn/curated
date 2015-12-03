from mongoengine import *


class User(Document):
    email = EmailField(required=True, unique=True)
    first_name = StringField(max_length=25)
    last_name = StringField(max_length=25)


class Book(Document):
    # TODO: Integrate with LibraryThing or GoodReads
    title = StringField(required=True)
    author = StringField()
    buy_link = URLField()


class ReadingList(Document):
    name = StringField(required=True)
    created_by = ReferenceField(User, required=True)
    description = StringField()
    books = ListField(ReferenceField(Book))
