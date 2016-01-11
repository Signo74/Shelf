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
      getAllShelves: function() {
        return Shelves.find().fetch();
      },
      // Book related methods
      addBook: function(book, shelves) {
        let date = new Date();
        let dateStr = date.toDateString();

        return Books.insert({
          book: book,
          addedOn: date,
          addedOnPretty: dateStr,
          contributor: Meteor.user()._id
        })
      },
      deleteBook: function(id) {
        Books.remove({_id:id})
      },
      deleteAllBooks: function() {
        Books.remove({});
        Shelves.update({}, {$unset: {'books':1}});
      },
      addBookToShelves: function(id, shelves) {
        console.log(shelves);
        let q =  [];
        for (let i = 0 ; i < shelves.length ; i++) {
          if (shelves[i].books) {
            for (let j = 0 ; j < shelves[i].books.length ; j++) {
              console.log(shelves[i]);
              if (shelves[i].books[j].indexOf(id) === -1) {
                let param = {
                  _id: shelves[i]._id
                }
                q.push(param);
              }
            }
          } else {
            let param = {
              _id: shelves[i]._id
            }
            q.push(param);
          }
        }

        Shelves.update({$or:q}, {$addToSet: {books: {'_id': id}}});
      },
      removeBookFromShelf: function(bookId, shelfID) {
        Shelves.update({_id:shelfID},
                     {$pull : { "books" : {"_id": bookId} }});
      },
      quickUpdateBook: function(id, title, author, description, shelves) {
        Books.update({_id:id},{$set :{
          title: title,
          author: author,
          desc: description,
          addedOn: new Date(),
          owner: Meteor.user()._id,
          updateOn: new Date(),
          updateBy: Meteor.user()._id
        }})
      },
      findBook: function(bookID) {
        let book = Books.find({'book.id':bookID}).fetch()[0];
        return book;
      },
      getBooksFromDB: function(query) {
        let books = Books.find({$or:[{'book.volumeInfo.title': {$regex : query, $options: '/^&/i'}}, {'book.volumeInfo.authors': {$regex : query, $options: '/^&/i'}}]}).fetch();
          // {'book.volumeInfo.authors': {$in: [query]}}
        return books;
      },
      checkIfUserHasBook: function(book, shelves) {
        // TODO
        for (let i = 0 ; i < shelves.length ; i++) {
          if (false) {
            throw new Meteor.Error(500, 'Internal server Error', 'This book already exists.');
          }
        }
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
      },
      addReview: function(score, bookId, title, content) {
        let date = new Date();
        let dateStr = date.toDateString()
        console.log(score);
        console.log(bookId);
        console.log(title);
        console.log(content);
        if ((score > 0 && score < 6) && bookId && title && content) {
          Reviews.insert({
            book: bookId,
            title: title,
            score: score,
            content: content,
            author: Meteor.user()._id,
            addedOn: date,
            addedOnString: dateStr
          })
        }
      }
    });
});
