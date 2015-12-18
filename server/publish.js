Meteor.publish('search_params', function() {
  return SearchParams.find();
});

Meteor.publish('shelves', function() {
  return Shelves.find({owner: this.userId},{title:1, desc:1});
});

Meteor.publish('books', function() {
  return Books.find();
})

Meteor.publish('book', function(bookId){
  return Books.find({_id: bookId});
});
