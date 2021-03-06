/*
 * Error codes:
 * 440 - User has provided wrong type, quantity, or format of data.
 * 441 - Target of the operation is incorrect. For example: wron shelf for drag and drop.
 *
 */
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
        let date = new Date();
        let dateStr = date.toDateString()
        console.log(`Book ID to add: ${id}`);

        for (let i = 0 ; i < shelves.length ; i++) {
          if (shelves[i].books && shelves[i].books.length > 0) {
            for (let j = 0 ; j < shelves[i].books.length ; j++) {
              if (shelves[i].books[j]._id === id) {
                console.log('Boook is already present in this shelf.');
                throw new Meteor.Error(441, 'Error 441: Incorrect target shelf', 'Boook is already added to this shelf.');
              }
            }

            let param = {
              _id: shelves[i]._id
            }
            q.push(param);
          } else {
            let param = {
              _id: shelves[i]._id
            }
            q.push(param);
          }
        }
        console.log(q);


        Shelves.update({$or:q}, {$addToSet: {books: {'_id': id, addedOn: date, addedOnPretty: dateStr}}}, {multi:true});
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
      },
      // User related methods
      registerUser: function(username, email, password, confirmPass) {
        let currentDate = new Date();
        let dateString  = currentDate.toDateString();
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(email)) {
          throw new Meteor.Error(440, 'Error 440: Incorrect data', 'The email you provided is not correct.');
        }

        if (password != confirmPass) {
            throw new Meteor.Error(440, 'Error 440: Incorrect data', 'The passwords you provided did not match.');
        }

        Accounts.createUser({
            username: username,
            email: email,
            password: password,
            createdOn: currentDate,
            createdOnPretty: dateString
        })

        console.log(`${username} registered with ${email}`)
        return true;
      },
      sendVerificaitonEmail: function(userId) {
        Accounts.sendVerificationEmail(userId);
      },
      createBaseShelves: function(userId) {
        Shelves.insert({
          title: 'Reading',
          desc: 'All the books you are currently in progress of reading.',
          createdOn: new Date(),
          owner: Meteor.user()._id
        });

        Shelves.insert({
          title: 'Read',
          desc: 'All the books you have read.',
          createdOn: new Date(),
          owner: Meteor.user()._id
        });

        Shelves.insert({
          title: 'Whishlist',
          desc: 'Books you would like to read.',
          createdOn: new Date(),
          owner: Meteor.user()._id
        });
      }
    });
});
