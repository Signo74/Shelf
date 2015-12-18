shelfTags = new ReactiveArray();

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

Template.ShelfTag.events({
  'click a.remove': function(event) {
    event.preventDefault();
    event.stopPropagation();

    removeItemByID(shelfTags, this.id);
  }
});

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

clearShelfTags = function() {
  shelfTags.splice(0, shelfTags.length);
}


checkLogin = function(context) {
  // context is the output of `FlowRouter.current()`
  if (!Meteor.users.find({}).fetch().length > 0) {
    FlowRouter.go('/');
  }
}

nullifyAll = function() {
  clearShelfTags();
}
