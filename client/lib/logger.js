let logLevel = 0;

let logger = {
  info: function(message, args) {
    let logAtLevel = 0;
    log(message, args, logAtLevel);
  },
  debug: function(message, args) {
    let logAtLevel = 1;
    log(message, args, logAtLevel);
  },
  error: function(message, args) {
    let logAtLevel = 2;
    log(message, args, logAtLevel);
  },
  fatal: function(message, args) {
    let logAtLevel = 3;
    log(message, args, logAtLevel);
  },
  log: function(message, args, logAtLevel) {
    console.log(message);
    if (args != undefined && logAtLevel >= logLevel) {
      console.log(args);
    }
  }
}
