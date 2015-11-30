// Collections to expose
SearchParams = new Mongo.Collection('search_params');
Shelves = new Mongo.Collection('shelves');
Books = new Mongo.Collection('books');

// Test ???
// if (Meteor.isClient) {
//   Template.search.events({
//     'submit .findBook': function (event) {
//       event.preventDefault();
//       Meteor.call('searchForBook', event.target.bookName.value, function() {
//         console.log('result!');
//       })
//     }
//   });
// }
