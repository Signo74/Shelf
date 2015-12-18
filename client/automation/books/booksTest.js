
Template.BookTests.helpers({
  shelves: function() {
    return Shelves.find({},{sort:{createdOn:1}}).fetch();
  }
});

Template.BookTests.events({
  'submit #insertBooks': function(event) {
    event.preventDefault();

    let form = event.target;
    let count = form.count.value;
    let title = form.namePrefix.value;
    let author = 'Uknown TEST Author';
    let desc = 'This is a tests book to enter in the shelves.\nA new line has been added to test.';

    for (let i = 0; i < count ; i++) {
      Meteor.call('addBook', title + i, author, desc, shelfTags.array());
    }

    event.target.count.value = null;
    event.target.namePrefix.value = '';
    clearShelfTags();
  }
});

Template.BookTests.onCreated(function() {
  let self = this;
  self.autorun(function() {
      self.subscribe('shelves');
  })
})
