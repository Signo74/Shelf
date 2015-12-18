Template.Reviews.helpers({
  reviews: function() {
    return [1,2,3,4,5];
  }
});

Template.Reviews.events({
  "submit #addReview": function(event, template){
    event.preventDefault();
  }
});
