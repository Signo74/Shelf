let currentTab = new ReactiveVar('Reviews');

Template.Book.helpers({
  book: function() {
    let bookID = FlowRouter.getParam('id');
    let book = Books.findOne({_id: bookID}) || {};

    return book;
  },
  socialTab: function() {
    return currentTab.get();
  }
});

Template.Book.events({
  'change #added': function(event) {
    console.log(event.target.value);
  },
  'click a.social': function(event) {
    event.preventDefault();
    currentTab.set($(event.target).data('tab'));
  }
});


Template.Book.onCreated(function() {
  let self = this;
  self.autorun(function(){
    let bookID = FlowRouter.getParam('id');
    self.subscribe('book', bookID);
  });
})

Template.Book.onRendered(function() {
  $('input.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 20 // Creates a dropdown of 15 years to control year
  });
});
