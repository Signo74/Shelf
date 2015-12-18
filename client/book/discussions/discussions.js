Template.Discussions.helpers({
  discussions: function() {
    return [1,2,3,4,5];
  }
});

Template.Discussions.events({
  "submit #startDiscussion": function(event, template){
    event.preventDefault();
  }
});
