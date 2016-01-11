
Template.Reviews.helpers({
  reviews: function() {
    return Reviews.find();
  }
});

Template.Reviews.events({
  'submit #addReview': function(event){
    event.preventDefault();
    let title = event.target.title.value;
    let content = event.target.content.value;
    let bookId = FlowRouter.getParam('id');
    let score = 0;

    $('#addReview').find('i.material-icons').each(function() {
      if ($(this).text() === 'star') {
        score++;
      }
    })
    if (score > 5) score = 5;

    Meteor.call('addReview', bookId, score, title, content);
    $('#addReview').find('i.material-icons').each(function() {
      $(this).text('star_border');
    })
    event.target.title.value = '';
    event.target.content.value = '';
  },
  'click a.rating': function(event) {
    let target = $(event.target);
    let obj = $(event.target).closest('a');

    target.text('star');
    obj.prevAll().each(function() {
      $(this).find('i').text('star');
    })

    obj.nextAll().each(function() {
      $(this).find('i').text('star_border');
    })
  }
});

Template.Review.helpers({
  reviewScore: function() {
    let stars = [];
    for (let i = 0 ; i < this.score ; i++) {
      stars.push('');
    }

    return stars;
  }
})


Template.Reviews.onCreated(function() {
  let self = this;
  self.autorun(function(){
    let bookID = FlowRouter.getParam('id');
    self.subscribe('reviews', FlowRouter.getParam('id'));
  });
})
