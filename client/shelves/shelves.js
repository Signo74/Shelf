let leftShelves = new ReactiveArray();
let shelfTags = new ReactiveArray();
let okCallback;
let submitCallback;

Template.ShelvesList.helpers({
  shelves: function() {
    initLeftShelves();
    return Shelves.find({},{sort:{createdOn:1}}).fetch();
  },
  unassignedShelves: function() {
    return leftShelves.list();
  },
  selectedShelves: function() {
    return shelfTags.list();
  }
});

Template.ShelvesList.events({
  'submit .newShelf':function(event) {
    event.preventDefault();
    let title = $('#newShelfTitle').val();
    let description = $('#newShelfDescription').val();

    submitCallback(title, description);

    $('#newShelfTitle').val('');
    $('#newShelfDescription').val('');
    $('#newShelf').closeModal();

    submitCallback = function() {
      $('#newBook').closeModal();
    }
  },
  'submit .newBook': function(event) {
    event.preventDefault();
    let title = $('#newBookTitle').val();
    let author = $('#newBookAuthor').val();
    let description = $('#newBookDescription').val();
    let shelves = shelfTags.array();

    submitCallback(title, author, description, shelves);

    $('#newBookTitle').val('');
    $('#newBookAuthor').val('');
    $('#newBookDescription').val('');
    $('#shelvesSelect').val('');
    initLeftShelves();

    $('#newBook').closeModal();

    submitCallback = function() {
      $('#newBook').closeModal();
    }
  },
  'change .shelvesSelect': function() {
    let id = $('#shelvesSelect').val();
    let tag = {
      id: id,
      title: $('#shelvesSelect option:selected').text()
    }
    shelfTags.push(tag);
    removeItemByID(leftShelves, id);
    $('#shelvesSelect').val('');
  },
  'click .close': function(event) {
    event.preventDefault();
    let button = event.target;
    $(button).closest('div.modal').closeModal();
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
      id: this._id,
      title: this.title
    }

    submitCallback = function(title, author, description, shelves) {
      Meteor.call('addBook', title, author, description, shelves);
    }

    shelfTags.push(tag);
    removeItemByID(leftShelves, this._id);

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
    return Books.find({owner: Meteor.user()._id,
                      shelves: {
                        $elemMatch: {
                          id: this._id
                        }
                      }});
  }
});

Template.AddShelf.events({
  'click .addShelf': function(event) {
    event.preventDefault();

        submitCallback = function(title, description) {
          Meteor.call('addShelf', title, description);
        }

    $('#newShelf').openModal();
  },
  'click .addBook': function() {
    shelfTags.splice(0, shelfTags.length);

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
  "click .delete": function(){
    let bookID = this._id;

    okCallback = function() {
      Meteor.call('deleteBook', bookID);
    }

    // TODO move all messages to a file for easier localization.
    $('#dialogContent').html(`Are you sure you want to delete ${this.title} from your collection?<br>This change will be permanent and there is no way to undo it!`);

    $('#dialog').openModal();
  },
  "click .edit": function(event){
    event.stopPropagation();
    let bookID = this._id;

    $('#newBookTitle').val(this.title);
    $('#newBookAuthor').val(this.author);
    $('#newBookDescription').val(this.description);

    // Empty the tags array first
    shelfTags.splice(0, shelfTags.length);

    for (let i = 0 ; i < this.shelves.length ; i++) {
      shelfTags.push(this.shelves[i]);
    }

    submitCallback = function(title, author, description, shelves) {
      Meteor.call('quickUpdateBook', bookID, title, author, description, shelves);
    }

    $('#newBook').openModal();
  }
});

Template.ShelfTag.events({
  'click .remove': function() {
    let shelf = {
      _id: this.id,
      title: this.title
    }
    removeItemByID(shelfTags, this.id);
    leftShelves.push(shelf);
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
      self.subscribe('shelves');
  })
});

Template.Shelf.onCreated(function() {
  let self = this;
  self.subscribe('books');
});

function initLeftShelves() {
  let arr = Shelves.find({},{fields:{title:1}}).fetch();
  for (let i = 0 ; i < arr.length ; i++) {
    leftShelves.push(arr[i]);
  }
}

function removeItemByID(array, id) {
  let index;
  for (let i = 0; i < array.length ; i++) {
    if (array[i]._id === id) {
      index = i;
      break;
    }
  }
  array.splice(index, 1);
}
