Template.Register.helpers({
});

Template.Register.events({
  'click #submitNewUser': function(event, template){
     event.preventDefault();
     let username = $('#username').val();
     let email = $('#email').val();
     let password = $('#password').val();
     let confirmPass = $('#confirmPass').val();

     Meteor.call('registerUser', username, email, password, confirmPass, function(error, result) {
       if (error) {

       } else if (result) {
         Meteor.loginWithPassword(username, password);
         // Send the verification email from the system
         Meteor.call('sendVerificaitonEmail', Meteor.userId());
         // Create the three main shelves for this user.
         Meteor.call('createBaseShelves', Meteor.userId(), function(error, result) {
           // TODO display a congratulations message and redirect the user to his/her shelves.
             FlowRouter.go('/shelves');
         });
       }
     });
  }
});
