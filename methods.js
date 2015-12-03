Meteor.startup(function () {
  Meteor.methods({
    addShelf: function(title, description) {
      Shelves.insert({
        title: title,
        desc: description,
        createdOn: new Date(),
        owner: Meteor.user()._id
      });
    },
    deleteShelf: function(id) {
      Shelves.remove({_id: id})
    },
    addBook: function(title, author, description, shelves) {
      Books.insert({
        title: title,
        author: author,
        desc: description,
        shelves: shelves,
        addedOn: new Date(),
        owner: Meteor.user()._id
      })
    },
    searchForBook: function(searchTerm, callback) {
      var searchURL = 'https://www.googleapis.com/customsearch/v1?';
      var searchTermObj = {
        key: 'q',
        value: searchTerm
      }

      var parameters = [];

      SearchParams.find().fetch().forEach(function(p) {
        var param = {
          key: p.key,
          value: p.value
        }
        console.log('P:' + p)
        this.push(param);
      }, parameters)

      parameters.push(searchTermObj);
      console.log(parameters);

      for (var i = 0; i < parameters.length ; i++) {
        searchURL += parameters[i].key;
        searchURL += '=';
        searchURL += parameters[i].value;

        if (i != parameters.length - 1) {
          searchURL += '&amp;';
        }
      }

      console.log(searchURL);
    }
  });
});
