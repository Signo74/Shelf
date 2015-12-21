let logLevel = 0;

let logger = {
  info: function(message, args) {
    if (debugLevel <= 0) {
      log(message, args);
    }
  },
  debug: function(message, args) {
    if (debugLevel <= 1) {
      log(message, args);
    }
  },
  error: function(message, args) {
    if (debugLevel <= 2) {
      log(message, args);
    }
  },
  fatal: function(message, args) {
    if (logLevel <= 3) {
      log(message, args);
    }
  },
  log: function(message, args) {
    console.log(message);
    if (args != undefined) {
      console.log(args);
    }
  }
}
