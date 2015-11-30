FlowRouter.route('/', {
  name: 'lobby',
  action: function() {
    BlazeLayout.render('main', { content: "Lobby"});
  }
});

FlowRouter.route('/shelves', {
  name: 'shelvesList',
  triggersEnter: [checkLogin],
  action: function() {
    BlazeLayout.render('main', { sideNav: 'ShelvesActions',content: 'ShelvesList', fab: 'AddShelf'});
  }
});


function checkLogin(context) {
  // context is the output of `FlowRouter.current()`
  if (!Meteor.user()) {
    FlowRouter.go('/');
  }
}


FlowRouter.notFound = {
    action: function() {
      BlazeLayout.render('main', {content: 'NotFound'});
    }
};
