shelfTags = new ReactiveArray();
searchedBooks = new ReactiveArray();

$(function() {
  $('body').on('change', '#shelvesSelect', function(event) {
    event.preventDefault();

    let id = $(this).val();
    let tag = {
      id: id,
      title: $('#shelvesSelect option:selected').text()
    }
    if (!searchArrayItemByID(tag, shelfTags)) {
      shelfTags.push(tag);
    }

    $('#shelvesSelect').val('');
  });
});

Template.registerHelper("selectedShelves", function(){
  return shelfTags.list();
});

Template.registerHelper("searchResults", function(){
  return searchedBooks.list();
});

Template.ShelfTag.events({
  'click a.remove': function(event) {
    event.preventDefault();
    event.stopPropagation();

    removeItemByID(shelfTags, this.id);
  }
});

searchForBook = function(title) {
  // TODO check Mongo for entries first so that you save an extra GAPI call.
  if (title != '') {
    Meteor.call('bookSearch', title, function(error, result) {
      if (error) {
        // TODO show message to user
        console.log(error);
        return false;
      }
      // reset old results and block submition
      searchedBooks.splice(0, searchedBooks.length);
      $('#submitBook').prop('disabled', true);

      let books = JSON.parse(result.content);
      count = books.items.length;

      for (let i = 0 ; i < count ; i++) {
        searchedBooks.push(books.items[i]);
      }
    });
  }
}

searchArrayItemByID = function(item, array) {
  for (let i = 0 ; i < array.length ; i++) {
    if (array[i].id === item.id) {
      return array[i];
    }
  }
  return false;
}

removeItemByID = function (array, id) {
  let index;

  for (let i = 0; i < array.length ; i++) {
    if (array[i].id === id) {
      index = i;
      break;
    }
  }

  array.splice(index, 1);
}

addTag = function(tag) {
  shelfTags.push(tag);
}

cleanupBookModal = function() {
  shelfTags.splice(0, shelfTags.length);
  searchedBooks.splice(0, searchedBooks.length);
}


checkLogin = function(context) {
  // context is the output of `FlowRouter.current()`
  if (!Meteor.users.find({}).fetch().length > 0) {
    FlowRouter.go('/');
  }
}

nullifyAll = function() {
  cleanupBookModal();
}
