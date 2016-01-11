Meteor.startup(function () {
  Meteor.methods({
    test_findBook: function() {
      let startTime;
      let endTime;
      // Hardcoded book ID
      let bookID = 99;
      let book;

      startTime = new Date();
      // Check if the user has the book added to one of his shelves already
      // Hardcoded test user: test
      let shelves = Shelves.find({owner: 'YpC2zfnkMs8mvXhJ7'}).fetch();

outerLoop:
      for (let i = 0 ; i < shelves.length ; i++) {
        let bookIDs = shelves[i].books;
        for (let j = 0; j < bookIDs.length ; j++) {
          if (bookID === bookIDs[j]) {
            book = Books.findOne({'book.id': bookIDs[j]});
            break outerLoop;
          }
        }
      }
      // Test time in ms.
      endTime = new Date().getTime() - startTime.getTime();
      console.log(`Time to find ${book.book.volumeInfo.title} in ${shelves.length} shelves:  ${endTime}ms`);
      return book;
    },
    test_findShelfBooks: function() {
        let startTime;
        let endTime;
        let books = [];
        let shelfNUmber = 0;

        startTime = new Date();
        // Hardcoded test user: test
        let shelves = Shelves.find({owner: 'YpC2zfnkMs8mvXhJ7'}).fetch();
        shelfNUmber = Math.floor(Math.random()*shelves.length);


        let bookIDs = shelves[shelfNUmber].books;
        for (let j = 0; j < bookIDs.length ; j++) {
            book = Books.findOne({'book.id': bookIDs[j]});
            books.push(book);
        }

        // Test time in ms.
        endTime = new Date().getTime() - startTime.getTime();
        console.log(`Time to find ${books.length} books in the ${shelves.title} shelf: ${endTime}ms`);
        return books;
    },
    test_findReaderBooks: function() {
        let startTime;
        let endTime;
        let books = [];

        startTime = new Date();
        // Hardcoded test user: test
        let shelves = Shelves.find({owner: 'YpC2zfnkMs8mvXhJ7'}).fetch();

        for (let i = 0 ; i < shelves.length ; i++) {
          let bookIDs = shelves[i].books;
          for (let j = 0; j < bookIDs.length ; j++) {
              book = Books.findOne({'book.id': bookIDs[j]});
              books.push(book);
          }
        }

        // Test time in ms.
        endTime = new Date().gхайдеetTime() - startTime.getTime();
        console.log(`Time to find ${books.length} books in ${shelves.length} shelves: ${endTime}ms`);
        return books;
    },
    test_batchCreateBooks: function(book, shelves, count, title, serial) {
      for (let i = 0; i < count ; i++) {
        let newBook = book;

        newBook.volumeInfo.title = title + i;
        newBook.id = i;
        createdBook = Meteor.call('addBook', book, shelves);
      }

      let endTime = new Date();

      return endTime;
    },
    test_batchCreateShelves: function(count, title) {
      let desc = 'Test shelf';
      let shelves = [];
      let books = Books.find().fetch();

      for (let i = 0; i < count ; i++) {
        let shelfName = title + i;
        let shelf = Meteor.call('addShelf',shelfName, desc);
      }

      for (let i = 0; i < count ; i++) {
        let shelfName = title + i;
        let shelf = Shelves.find({'title': shelfName});
        shelves.push(shelf);
      }

      let endTime = new Date();

      return endTime;
    }
  });
});
