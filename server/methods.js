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
          score: 0,
          reviewsCount: 0,
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
        let q =  [];

        for (let i = 0 ; i < shelves.length ; i++) {
          if (shelves[i].books) {
            for (let j = 0 ; j < shelves[i].books.length ; j++) {
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

        Shelves.update({$or:q}, {$addToSet: {books: {'_id': id}}}, {multi:true});
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
        return books;
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
      addReview: function(bookId, score, title, content, totalScore, totalReviews) {
        let date = new Date();
        let dateStr = date.toDateString()

        if (title === undefined) {
          title = '';
        }

        if (content === undefined) {
          content = '';
        }

        if ((score > 0 && score < 6) && bookId) {
          Reviews.insert({
            book: bookId,
            title: title,
            score: score,
            content: content,
            author: Meteor.user().username,
            authorId: Meteor.user()._id,
            addedOn: date,
            addedOnPretty: dateStr
          });

          totalReviews++;

          if (totalReviews > 1) {
            score -= totalScore;
            totalScore += score / totalReviews;
          } else {
            totalScore = score;
          }

          Books.update({_id:bookId},{
            $set:{
              score: totalScore,
              reviewsCount: totalReviews
            }
          })
        }
      },
      removeReview: function(reviewId, bookId, totalReviews, updatedScore, bookScore) {
        if (totalReviews > 1) {
          updatedScore = bookScore*totalReviews - updatedScore;
          updatedScore /= --totalReviews;
        } else {
          updatedScore = 0;
          totalReviews = 0;
        }

        Reviews.remove({_id:reviewId, authorId: Meteor.user()._id});
        Books.update({_id: bookId}, {$set: {score: updatedScore, reviewsCount:totalReviews}});
      },
      updateReview: function(bookId, reviewId, score, title, content, scoreDiff, totalScore, totalReviews) {
        let updatedScore;
        if (totalReviews > 1) {
          updatedScore = totalScore +  scoreDiff / totalReviews;
        } else {
          updatedScore = score;
        }

        Reviews.update({_id:reviewId, authorId: Meteor.user()._id}, {$set: {score:score, title: title, content:content}})
        Books.update({_id: bookId}, {$set: {score: updatedScore}});
      }
    });
});
