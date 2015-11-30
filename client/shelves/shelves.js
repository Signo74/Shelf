let tempShelfID;
let tempShelfName;

Template.ShelvesList.helpers({
  shelves: function() {
    return Shelves.find().fetch();
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
    let shelves = form.shelves.value;

    console.log(`title: ${title}, author: ${author}, desc: ${description}, shelves: ${shelves}`);

    // TODO ceate a method for inserting Books and call it.

    form.title.value = '';
    form.author.value = '';
    form.description.value = '';
    form.shelves.value = '';
    $('#newBook').closeModal();
  }
})

Template.Shelf.events({
  'click .deleteCard': function() {
    // Open the confirmation dialog.
    tempShelfID = this._id;
     $('#dialog').openModal();
  },
  'click .addBook': function() {
    // TODO Add a book to this shlef
    tempShelfID = this._id;
    tempShelfName = this.title;
    $('#newBook').openModal();
  },
  'click .edit':function() {
    // TODO  Edit the shelf's properties.
  }
});

Template.Shelf.helpers({
  books: function() {
    return Books.find();
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
  "click .addShelf": function(event){
    event.preventDefault();
    $('#newShelf').openModal();
  }
});


Template.ShelvesList.onCreated(function() {
  let self = this;
  self.autorun(function() {
      self.subscribe('shelves');
  })
});

Template.ShelvesList.onRendered(function() {
  // Initializes the Materialize Select styling and functionality.
  // TODO doesn't work properly with Multiple.
  $('select').material_select();
})

Template.Shelf.onCreated(function() {
  let self = this;
  self.autorun(function() {
      self.subscribe('books', self.data._id);
  })
});
