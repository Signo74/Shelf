Meteor.publish('search_params', function() {
  return SearchParams.find();
});

Meteor.publish('shelves', function() {
  return Shelves.find({owner: this.userId});
});

Meteor.publish('bookShelves', function(bookId) {
  return Shelves.find({owner:this.userId, book:bookId});
});

Meteor.publish('books', function() {
  return Books.find();
})

Meteor.publish('book', function(bookId){
  return Books.find({_id: bookId});
});

Meteor.publish('reviews', function(bookId) {
  return Reviews.find({book: bookId});
})
