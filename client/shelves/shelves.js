let okCallback;
let submitCallback;
let selectedBook;

Template.ShelvesList.helpers({
  shelves: function() {
    return Shelves.find().fetch();
  },
  results: function() {
    return loading.get();
  }
});

Template.ShelvesList.events({
  'keypress #searchBooksInput': function(event) {
    if (event.keyCode === 13){
      let title = event.target.value;
      searchForBook(title);
      return false;
    }
  },
  'click #searchBook': function(event) {
    let query = $(event.target).closest('a').next().val();
    searchForBook(query);
  },
  'click div.searchEntry': function() {
    // Assign the selected book
    selectedBook = this;
    console.log(this);
    let book = this.volumeInfo;
    let authorsCount;
    let authors = '';

    if (book.authors != undefined) {
      authorsCount = book.authors.length;
      for (let i = 0 ; i < authorsCount ; i++) {
        if (i === (authorsCount - 1)) {
          authors += book.authors[i];
        } else {
          authors += book.authors[i] + ', ';
        }
      }
    }

    if (book.description) {
      $('#newBookDescription').text(book.description);
    } else {
      $('#newBookDescription').text('');
    }
    $('#tempBookIcon').addClass('hidden');
    $('#tempBookIcon').removeClass('material-icons');
    $('#newBookThumbnail').prop('src', book.imageLinks.thumbnail);
    $('#submitBook').prop('disabled', false);
  },
  'click #submitShelf': function(event) {
    event.preventDefault();
    event.stopPropagation();

    let title = $('#newShelfTitle').val();
    let description = $('#newShelfDescription').val();

    submitCallback(title, description);

    submitCallback = function() {
      $('#newBook').closeModal();
    }
    cleanNewShelfModal();
    $('#newShelf').closeModal();
  },
  'click #submitBook': function(event) {
    // TODO check the Mongo for a book entry first to avoid duplicates.
    event.preventDefault();
    let shelves = shelfTags.array();

    Meteor.call('findBook', selectedBook.id, function(error, result){
      if(error){
        logger.error("error", error);
      }

      if(!result){
        Meteor.call('addBook', selectedBook, shelves, function(error, result) {
          Meteor.call('addBookToShelves',result, shelves);
        });
      } else {
        Meteor.call('addBookToShelves', result._id, shelves);
      }
    });

    $('#newBook').closeModal();

    submitCallback = function() {
      $('#newBook').closeModal();
    }
    cleanNewBookModal();
  },
  'click button.close': function(event) {
    event.preventDefault();
    let button = event.target;
    let form = $(event.target).closest('div.modal');

    // Clean up the form.
    form.find('input').each(function() {
      $(this).val('');
    })

    form.find('p').text('');

    $(button).closest('div.modal').closeModal();

    // Clean up the rest of the dialog parameters.
    $('#newBookThumbnail').prop('src', '');
    shelfTags.splice(0, shelfTags.length);
    searchedBooks.splice(0, searchedBooks.length);
  }
})

Template.Shelf.events({
  'click .remove': function() {
    // Open the confirmation dialog.
    let id = this._id;

    okCallback = function() {
      Meteor.call('deleteShelf', id);
    }

    // TODO move all messages to a file for easier localization.
    $('#dialogContent').html(`Are you sure you want to delete the ${this.title} Shelf?<br>This change will be permanent and there is no way to undo it!`);

    $('#dialog').openModal();
  },
  'click .addBook': function() {
    let tag = {
      _id: this._id,
      title: this.title
    }

    $('#tempBookIcon').addClass('material-icons');

    submitCallback = function(title, author, description, shelves) {
      Meteor.call('addBook', title, author, description, shelves);
    }

    cleanNewBookModal();
    shelfTags.push(tag);

    $('#newBook').openModal();
  },
  'click .edit':function() {
    let shelfID = this._id;
    submitCallback = function(title, description) {
      Meteor.call('updateShelf', shelfID, title, description);
    }

    $('#newShelfTitle').val(this.title);
    $('#newShelfDescription').val(this.desc);

    $('#newShelf').openModal();
  }
});

Template.Shelf.helpers({
  books: function() {
    let bookIDs = this.books;
    if (bookIDs != undefined) {
      return Books.find({$or:bookIDs});
    }
  }
});

Template.AddShelf.events({
  'click .addShelf': function(event) {
    event.preventDefault();

    submitCallback = function(title, description) {
      Meteor.call('addShelf', title, description);
    }

    cleanNewShelfModal();
    $('#newShelf').openModal();
  },
  'click .addBook': function() {
    cleanupBookModal();

    submitCallback = function(title, author, description, shelves) {
      Meteor.call('addBook', title, author, description, shelves, function(error, result){
        if(error){
          // TODO make a practice of showing an error message!
          console.log("error", error);
        }
        if(result){
          // TODO if necessary handle the result
        }
      });
    }

    cleanNewBookModal();

    $('#newBook').openModal();
  }
});

Template.BookThumbnail.events({
  "click .remove": function(event){
    event.stopPropagation();
    let bookID = this._id;
    let shelf = Template.parentData(1);

    okCallback = function() {
      Meteor.call('removeBookFromShelf', bookID, shelf._id);
    }

    // TODO move all messages to a file for easier localization.
    $('#dialogContent').html(`Are you sure you want to remove ${this.title} from your ${shelf.title} Shelf?<br>This change will be permanent and there is no way to undo it!`);

    $('#dialog').openModal();
  },
  "click .edit": function(event){
    event.stopPropagation();
    let bookID = this._id;

    $('#searchBooksInput').val(this.title);
    $('#newBookDescription').text(this.description);

    // Empty the tags array first
    cleanupBookModal();

    for (let i = 0 ; i < this.shelves.length ; i++) {
      shelfTags.push(this.shelves[i]);
    }

    submitCallback = function(title, author, description, shelves) {
      Meteor.call('quickUpdateBook', bookID, title, author, description, shelves);
    }

    $('#newBook').openModal();
  },
  'click .bookItem': function() {
    FlowRouter.go('/book/' + this._id);
  }
});

Template.CommonDialog.events({
  'click .confirm': function() {
    // Delete the shelf entry.
    okCallback();
    $('#dialog').closeModal();
    okCallback = function() {
      $('#dialog').closeModal();
    }
  },
  'click .cancel': function() {
    $('#dialog').closeModal();
  }
})

Template.ShelvesList.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('books');
    self.subscribe('shelves');
    self.subscribe('search_params');
  })
});

Template.Shelf.onCreated(function() {
  let self = this;
  self.subscribe('books');
});


cleanNewBookModal = function() {
  // Reset the Spinner.
  loading.set('');
  // Clean up the Modal.
  $('#searchBooksInput').val('');
  $('#newBookDescription').text('');
  $('#shelvesSelect').val('');
  $('#newBookThumbnail').prop('src', '');
  $('#submitBook').attr('disabled', true);

  shelfTags.splice(0, shelfTags.length);
  searchedBooks.splice(0, searchedBooks.length);
}

cleanNewShelfModal = function() {
  $('#newShelfTitle').val('');
  $('#newShelfDescription').val('');
}
