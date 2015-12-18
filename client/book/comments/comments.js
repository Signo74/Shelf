Template.Comments.helpers({
  comments: function() {
    return [1,2,3,4,5];
  }
});

Template.Comments.events({
  "submit #addComment": function(event, template){
    event.preventDefault();
  }
});
