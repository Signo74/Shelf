
Template.Reviews.helpers({
  reviews: function() {
    return Reviews.find();
  },
  hasReview: function() {
    let reviewCount = Reviews.find({authorId:Meteor.user()._id, book: FlowRouter.getParam('id')}).count();
    let result = reviewCount <= 0;
    return result;
  }
});

Template.Reviews.events({
  'submit #addReview': function(event){
    event.preventDefault();
    let title = event.target.title.value;
    let content = event.target.content.value;
    let bookId = FlowRouter.getParam('id');
    let score = 0;
    let totalScore = this.score;
    let totalReviews = this.reviewsCount;

    $('#addReview').find('i.material-icons').each(function() {
      if ($(this).text() === 'star') {
        score++;
      }
    })
    if (score > 5) score = 5;

    Meteor.call('addReview', bookId, score, title, content, totalScore, totalReviews);

    $('#addReview').find('i.material-icons').each(function() {
      $(this).text('star_border');
    });

    event.target.title.value = '';
    event.target.content.value = '';
  },
  'submit #updateReview': function(event) {
    event.preventDefault();
    let title = event.target.title.value;
    let content = event.target.content.value;
    let bookId = FlowRouter.getParam('id');
    let score = 0;
    let totalScore = this.score;
    let totalReviews = this.reviewsCount;
    let scoreDiff;
    let reviewId = Session.get('reviewId');

    $('#updateReview').find('i.material-icons').each(function() {
      if ($(this).text() === 'star') {
        score++;
      }
    })
    if (score > 5) score = 5;
    scoreDiff = score - Session.get('currentScore');
    console.log(score);

    Meteor.call('updateReview',bookId, reviewId, score, title, content, scoreDiff, totalScore, totalReviews);

    $('#updateReview').find('i.material-icons').each(function() {
      $(this).text('star_border');
    })
    event.target.title.value = '';
    event.target.content.value = '';
    $('#reviewUpdate').closeModal();
  },
  'click .close': function() {
    $('#updateTitle').val('');
    $('#updateContent').val('');

    $('#reviewUpdate').closeModal();
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
  },
  isRecent: function() {
    if (Meteor.user() && this.authorId === Meteor.user()._id) {
      let today = new Date();
      // One day in miliseconds
      let aDay = 2*12*60*60*1000;

      if (today - this.addedOn < aDay) {
        return true;
      }
      return false;
    }
    return false;
  }
});

Template.Review.events({
  'click a.remove': function() {
    let totalReviews = Template.parentData().reviewsCount;
    let bookId = Template.parentData()._id;
    let bookScore = Template.parentData().score;
    let updatedScore = this.score;

    if (totalReviews > 1) {
      updatedScore = bookScore*2 - updatedScore;
    } else {
      updatedScore = 0;
    }

    Meteor.call('removeReview', this._id, bookId, updatedScore);
  },
  'click a.edit': function() {
    let score = this.score;

    Session.set('currentScore', score);
    Session.set('reviewId', this._id);

    $('#updateReview').find('i.material-icons').each(function(index) {
      if (index < score) {
        $(this).text('star');
      }
    });

    $('#updateTitle').val(this.title);
    $('#updateContent').val(this.content);

    $('#reviewUpdate').openModal();
  }
});

Template.Reviews.onCreated(function() {
  let self = this;
  self.autorun(function(){
    let bookID = FlowRouter.getParam('id');
    self.subscribe('reviews', FlowRouter.getParam('id'));
  });
})
