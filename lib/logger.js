logLevel = -1;

logger = {
  test: function(message, args) {
    let logAtLevel = -1;
    this.log(message, args, logAtLevel);
  },
  debug: function(message, args) {
    let logAtLevel = 0;
    this.log(message, args, logAtLevel);
  },
  info: function(message, args) {
    let logAtLevel = 1;
    this.log(message, args, logAtLevel);
  },
  error: function(message, args) {
    let logAtLevel = 2;
    this.log(message, args, logAtLevel);
  },
  fatal: function(message, args) {
    let logAtLevel = 3;
    this.log(message, args, logAtLevel);
  },
  log: function(message, args, logAtLevel) {
    if (logAtLevel >= logLevel) {
      console.log(message);
      if (args != undefined) {
        console.log(args);
      }
    }
  }
}
