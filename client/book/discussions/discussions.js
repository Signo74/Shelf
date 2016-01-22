Template.Discussions.helpers({
  discussions: function() {
    return [];
  }
});

Template.Discussions.events({
  "submit #startDiscussion": function(event, template){
    event.preventDefault();
  }
});
