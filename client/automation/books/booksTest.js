
Template.BookTests.helpers({
  shelves: function() {
    return Shelves.find({},{sort:{createdOn:1}}).fetch();
  }
});

Template.BookTests.events({
  'submit #insertBooks': function(event) {
    event.preventDefault();

    let form = event.target;
    let count = form.count.value;
    let title = form.namePrefix.value;
    let book;
    let shelves = shelfTags.array();
    let startTime = new Date();

    Meteor.call('bookSearch', 'Metro 2034', function(error, result) {
      let books = JSON.parse(result.content);
      let duration;
      book = books.items[0];

      Meteor.call('test_batchCreateBooks', book, shelves, count, title, function(error, result) {
        duration = result.getTime() - startTime.getTime();
        logger.info(`Time to create ${count} books in ${shelves.length} shelves: ${duration}ms`);
      });
    });
  },
  'click #selectAllShelves': function() {
    Meteor.call('getAllShelves', function(error, result) {
      let shelves = result
      for (let i = 0 ; i < shelves.length; i++) {
        shelfTags.push(shelves[i]);
      }
    });
  },
  'click #findBook': function(event) {
    event.preventDefault();
    event.stopPropagation();
    let startTime = new Date();

    Meteor.call('test_findBook', function(error, result) {
      let endTime = new Date();
      let duration = endTime.getTime() - startTime.getTime();
      logger.info(`Duration: ${duration}ms`);
      logger.test(result);
    });
  },
  'click #findShelfBooks': function(event) {
    event.preventDefault();
    event.stopPropagation();
    let startTime = new Date();

    Meteor.call('test_findShelfBooks', function(error, result) {
      let endTime = new Date();
      let duration = endTime.getTime() - startTime.getTime();
      logger.info(`Duration: ${duration}ms`);
      logger.test(result);
    });
  },
  'click #findReaderBooks': function(event) {
    event.preventDefault();
    event.stopPropagation();
    let startTime = new Date();

    Meteor.call('test_findReaderBooks', function(error, result) {
      let endTime = new Date();
      let duration = endTime.getTime() - startTime.getTime();
      logger.info(`Duration: ${duration}ms`);
      logger.test(result);
    });
  },
  'click #deleteAllBooks': function() {
    Meteor.call('deleteAllBooks');
  }
});

Template.BookTests.onCreated(function() {
  let self = this;
  self.autorun(function() {
      self.subscribe('shelves');
  })
})
