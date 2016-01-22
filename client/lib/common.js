shelfTags = new ReactiveArray();
searchedBooks = new ReactiveArray();
loading = new ReactiveVar('');

$(function() {
  $('body').on('change', '#shelvesSelect', function(event) {
    event.preventDefault();

    let id = $(this).val();
    let tag = {
      _id: id,
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

Template.registerHelper("isMature", function(){
  if (this.volumeInfo.matureRating === 'MATURE') {
    return true;
  }

  return false;
});

Template.ShelfTag.events({
  'click a.remove': function(event) {
    event.preventDefault();
    event.stopPropagation();

    removeItemByID(shelfTags, this.id);
  }
});

searchForBook = function(query) {
  if (query != '' && query != undefined) {
    // Start the Spinner
    loading.set('Spinner');
    // Reset the previous search results
    searchedBooks.splice(0, searchedBooks.length);

    Meteor.call('getBooksFromDB', query, function(error, result) {
      if (error) {
        // TODO show message to user
        console.log(error);
        return false;
      }

      for (let i = 0 ; i < result.length ; i++) {
        searchedBooks.push(result[i].book);
      }

      // Stop the Spinner
      if (searchedBooks.length > 0) {
        loading.set('SearchResults');
      }

      Meteor.call('bookSearch', query, function(error, result) {
        if (error) {
          // TODO show message to user
          console.log(error);
          return false;
        }
        let books = JSON.parse(result.content);
        let count = books.items.length;
        let alreadyAddedCount = searchedBooks.length;

  searcheResults:
        for (let i = 0 ; i < count ; i++) {
          for (let j = 0 ; j < alreadyAddedCount ; j++) {
            if (compareBookObjects(searchedBooks[j], books.items[i])) {
              continue searcheResults;
            }
          }
          searchedBooks.push(books.items[i]);
        }

        // Stop the Spinner
        if (searchedBooks.length > 0) {
          loading.set('SearchResults');
        } else {
          loading.set('NoResultsFound');
        }
      });
    });
  }
}

searchArrayItemByID = function(item, array) {
  for (let i = 0 ; i < array.length ; i++) {
    if (array[i]._id === item._id) {
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
  Shelves.find().fetch()
  // context is the output of `FlowRouter.current()`
  if (!Meteor.users.find({}).fetch().length > 0) {
    FlowRouter.go('/');
  }
}

nullifyAll = function() {
  cleanupBookModal();
}

compareBookObjects = function(book1, book2) {
  let volume1 = book1.volumeInfo;
  let volume2 = book2.volumeInfo;

  if (volume1.title != volume2.title) {
    if (volume1.authors && volume2.authors) {
      if (volume1.authors.length != volume2.authors.length) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  } else {
    let authors1 = volume1.authors;
    let authors2 = volume2.authors;

    if (authors1 && authors2) {
      for (let i = 0 ; i < authors1.length ; i++) {
        if (authors1[i] != authors2[i]) {
          return false;
        }
      }
    }
  }
  return true;
}
