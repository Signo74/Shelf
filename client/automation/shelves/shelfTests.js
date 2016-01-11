Template.ShelfTests.events({
  'submit #insertShelves': function(event) {
    event.preventDefault();

    let form = event.target;
    let count = form.count.value;
    let title = form.namePrefix.value;
    let startTime = new Date();

    Meteor.call('test_batchCreateShelves', count, title, function(error, result) {
      duration = result.getTime() - startTime.getTime();
      logger.info(`Time to create ${count} shelves: ${duration}ms`);
    });

  },
  'click #findShelf': function(event) {
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
