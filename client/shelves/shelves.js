let leftShelves = new ReactiveArray();
let shelfTags = new ReactiveArray();

Template.ShelvesList.helpers({
  shelves: function() {
    initLeftShelves();
    return Shelves.find().fetch();
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
    let title = event.target.title.value;
    let description = event.target.description.value;
    Meteor.call('addShelf', title, description);

    event.target.title.value = '';
    event.target.description.value = '';
    $('#newShelf').closeModal();
  },
  'submit .newBook': function(event) {
    event.preventDefault();

    let form = event.target;
    let title = form.title.value;
    let author = form.author.value;
    let description = form.description.value;
    let shelves = shelfTags.array();

    console.log(`title: ${title}, author: ${author}, desc: ${description}, shelves: ${shelves}`);

    // TODO ceate a method for inserting Books and call it.
    Meteor.call('addBook', title, author, description, shelves, function(error, result){
      if(error){
        // TODO make a practice of showing an error message!
        console.log("error", error);
      }
      if(result){
        // TODO if necessary handle the result
      }
    });

    form.title.value = '';
    form.author.value = '';
    form.description.value = '';
    $('#shelvesSelect').val('');
    initLeftShelves();

    $('#newBook').closeModal();
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
  }
})

Template.Shelf.events({
  'click .remove': function() {
    // Open the confirmation dialog.
    tempShelfID = this._id;
     $('#dialog').openModal();
  },
  'click .addBook': function() {
    let tag = {
      id: this._id,
      title: this.title
    }

    shelfTags.push(tag);
    removeItemByID(leftShelves, this._id);

    $('#newBook').openModal();
  },
  'click .edit':function() {
    // TODO  Edit the shelf's properties.
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

Template.CommonDialog.events({
  'click .confirm': function() {
    // Delete the shelf entry.
    Meteor.call('deleteShelf', tempShelfID);
    $('#dialog').closeModal();
  },
  'click .cancel': function() {
    $('#dialog').closeModal();
  }
})

Template.AddShelf.events({
  'click .addShelf': function(event) {
    event.preventDefault();
    $('#newShelf').openModal();
  },
  'click .addBook': function() {
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
})

Template.BookThumbnail.events({
  "click .remove": function(){
    console.log(this._id);
  }
});


Template.ShelvesList.onCreated(function() {
  let self = this;
  self.autorun(function() {
      self.subscribe('shelves');
  })
});

Template.Shelf.onCreated(function() {
  let self = this;
  self.subscribe('books');
  // self.autorun(function() {
  // })
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
