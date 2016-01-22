let currentTab = new ReactiveVar('Reviews');

Template.Book.helpers({
  volume: function() {
    let bookID = FlowRouter.getParam('id');
    let book = Books.findOne({_id: bookID}) || {};

    return book;
  },
  socialTab: function() {
    return currentTab.get();
  },
  shelves: function() {
    let bookId = FlowRouter.getParam('id');

    return Shelves.find({books:{_id:bookId}},{title:1});
  },
  reviews: function() {
    return Reviews.find({book:FlowRouter.getParam('id')}).count();
  },
  bookStars: function() {
    let starsArr = [];
    let i = 1;
    for ( ; i <= this.score ; i++) {
      starsArr.push('star');
    }

    if (i - this.score < 1 && i - this.score > 0) {
      starsArr.push('star_half');
      i++;
    }

    for (; i <= 5 ; i++) {
      starsArr.push('star_border');
    }

    return starsArr;
  },
  bookScore: function() {
    return this.score.toFixed(2);
  }
});

Template.Book.events({
  'change #added': function(event) {
    console.log(event.target.value);
  },
  'click a.social': function(event) {
    event.preventDefault();
    currentTab.set($(event.target).data('tab'));
  }
});


Template.Book.onCreated(function() {
  let self = this;
  self.autorun(function(){
    let bookID = FlowRouter.getParam('id');
    self.subscribe('book', bookID);
    self.subscribe('reviews', bookID);
    self.subscribe('shelves');
  });
})
