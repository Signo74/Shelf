  Meteor.startup(function () {
    Meteor.methods({
      // Shelf related methods
      addShelf: function(title, description) {
        Shelves.insert({
          title: title,
          desc: description,
          createdOn: new Date(),
          owner: Meteor.user()._id
        });
      },
      deleteShelf: function(id) {
        Shelves.remove({_id: id})
      },
      updateShelf: function(id, title, description) {
        Shelves.update({_id:id}, {$set: {
          title: title,
          desc: description,
          updatedOn: new Date(),
          updatedBy: Meteor.user()._id
        }})
      },
      // Book related methods
      addBook: function(book, shelves) {
        let date = new Date();
        let dateStr = date.toDateString();

        Books.insert({
          book: book,
          shelves: shelves,
          addedOn: date,
          addedOnPretty: dateStr, 
          contributor: Meteor.user()._id
        })
      },
      deleteBook: function(id) {
        Books.remove({_id:id})
      },
      removeBookFromShelf: function(bookId, shelfID) {
        Books.update({_id:bookId},
                     {$pull : { "shelves" : {"id": shelfID} }});
      },
      quickUpdateBook: function(id, title, author, description, shelves) {
        Books.update({_id:id},{$set :{
          title: title,
          author: author,
          desc: description,
          shelves: shelves,
          addedOn: new Date(),
          owner: Meteor.user()._id,
          updateOn: new Date(),
          updateBy: Meteor.user()._id
        }})
      },
      bookSearch: function(searchTerm) {
        this.unblock();
        let searchURL = 'https://www.googleapis.com/books/v1/volumes?';
        let searchTermObj = {
          key: 'q',
          value: searchTerm
        }

        let param = SearchParams.findOne({'key':'key'});

        searchURL += param.key;
        searchURL += '=';
        searchURL += param.value;
        searchURL += '&';
        searchURL += searchTermObj.key;
        searchURL += '=';
        searchURL += searchTermObj.value;

        let results = {};
        try {
          results = HTTP.get(searchURL);
          return results;
        } catch (ex) {
          let message = `Could not retrieve search results for title: ${searchTerm}`
          console.log(message);
          console.log(ex);
          return `Could not retrieve search results for title: ${searchTerm}`;
        }
      }
  });
});
