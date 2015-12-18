FlowRouter.route('/', {
  name: 'lobby',
  triggersEnter: [checkLogin],
  action: function() {
    if (Meteor.users.find({}).fetch().length > 0) {
      // TODO set the home dashboard here. News, statistics, friend requests, etc.
      // TODO remove shelves once the above is done.
      BlazeLayout.render('main', {content: 'ShelvesList', fab: 'AddShelf'});
    } else {
      BlazeLayout.render('main', { content: "NotLoggedIn"});
    }
  },
  triggersExit: [nullifyAll]
});

FlowRouter.route('/shelves', {
  name: 'shelvesList',
  triggersEnter: [checkLogin],
  action: function() {
    BlazeLayout.render('main', {content: 'ShelvesList', fab: 'AddShelf'});
  },
  triggersExit: [nullifyAll]
});

FlowRouter.route('/book/:id', {
  name: 'shelvesList',
  triggersEnter: [checkLogin],
  action: function() {
    BlazeLayout.render('main', {content: 'Book'});
  },
  triggersExit: [nullifyAll]
});

FlowRouter.route('/tests', {
  triggersEnter: [checkLogin],
  action: function() {
    let user = Meteor.users.find({}).fetch()[0];
    if(user.profile && user.profile.toLowerCase() === 'administrator') {
      BlazeLayout.render('main', {content: 'Tests'});
    } else {
      BlazeLayout.render('main', {content: 'NotAuthorised'});
    }
  },
  triggersExit: [nullifyAll]
});

FlowRouter.notFound = {
    action: function() {
      BlazeLayout.render('main', {content: 'NotFound'});
    }
};
