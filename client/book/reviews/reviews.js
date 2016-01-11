Template.Reviews.helpers({
  reviews: function() {
    return [];
  }
});

Template.Reviews.events({
  'submit #addReview': function(event, template){
    event.preventDefault();
  },
  'click a.rating': function(event) {
    let score = 1;
    let target = $(event.target).closest('a');

    score = 5 - target.nextAll().length;
    Meteor.call('addReview');
  }
});
