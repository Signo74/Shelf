let currentTab = new ReactiveVar("BookTests")
Template.Tests.helpers({
  testTab: function() {
    return currentTab.get();
  }
});

Template.Tests.events({
  "click #foo": function(event, template){

  }
});
