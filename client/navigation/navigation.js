Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.Navigation.helpers({
});

Template.Navigation.events({
  "click #login": function(event, template){
    event.preventDefault();
    $('.loginForm').removeClass('hidden');
    $('#login').addClass('hidden');
    $('#loginUser').focus();
  },
  "click #hideLoginForm": function(event, template){
    event.preventDefault();

    $('.loginForm').addClass('hidden');
    $('#login').removeClass('hidden');
  },
  "click #loginSubmit": function(event, template){
    event.preventDefault();

    let username = $('#loginUser').val();
    let password = $('#loginPass').val();

    Meteor.loginWithPassword(username, password, function() {
      $('#login').addClass('hidden');
      $('#registerUser').addClass('hidden');
      $('.loginForm').addClass('hidden');
      $('#logout').removeClass('hidden');
      Meteor.logoutOtherClients();

      FlowRouter.go('/shelves');
    });
  },
  "click #logout": function(event, template){
    event.preventDefault();

    Meteor.logout(function() {
      $('#login').removeClass('hidden');
      $('#registerUser').removeClass('hidden');
      $('#logout').addClass('hidden');
      FlowRouter.go('/');
    });
  }
});
