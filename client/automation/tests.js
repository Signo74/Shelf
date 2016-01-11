let currentTab = new ReactiveVar("BookTests");

Template.Tests.helpers({
  testTab: function() {
    return currentTab.get();
  }
});

Template.Tests.events({
  'click a.test': function(event) {
    event.preventDefault();
    currentTab.set($(event.target).data('tab'));
  }
});
