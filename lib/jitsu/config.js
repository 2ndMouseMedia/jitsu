/*
 * config.js: Configuration for the jitsu CLI.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var path = require('path'),
    winston = require('winston'),
    fs = require('fs');

var config = exports, settings = config.settings = {
  root: process.env.HOME,
  remoteUri: 'http://localhost',
  userconfig: '.jitsuconf'
};

//
// ### @log {Object}
// Log level configuration for jitsu.
//
var log = config.log =  {
  levels: {
    silly: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    info: 4,
    warn: 5,
    debug: 6,
    error: 7
  },
  colors: {
    silly: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  }
};

//
// Configure winston with the levels and colors that we've defined
//
winston.emitErrs = false;
winston.defaultTransports().console.colorize = true;
winston.defaultTransports().console.timestamp = false;
winston.padLevels = true;
winston.setLevels(log.levels);
winston.addColors(log.colors);

//
// TODO (indexzero): Load this in config.js
//
winston.defaultTransports().console.level = 'silly';

//
// ### function load (callback)
// #### @callback {function} Continuation to pass control to when complete.
// Loads the settings for this process.
//
config.load = function (callback) {
  fs.readFile(config.filepath(), function (err, data) {
    if (err && /ENOENT, No such file/.test(err.message)) {
      return config.save(function (err) {
        return err ? callback(err) : callback();
      });
    }
    else if (err) {
      return callback(err);
    }
    
    data = JSON.parse(data.toString());
    Object.keys(data).forEach(function (key) {
      config.settings[key] = data[key];
    });
    
    callback();
  });
};

//
// ### function save (callback)
// #### @callback {function} Continuation to pass control to when complete.
// Saves the settings to the specified location for `.jitsuconf`
//
config.save = function (callback) {
  fs.writeFile(config.filepath(), JSON.stringify(config.settings), function (err) {
    return err ? callback(err) : callback();
  });
};

//
// ### function filepath ()
// Gets the full path for the user config file. 
//
config.filepath = function () {
  return path.join(settings.root, settings.userconfig);
};

//
// ### @username {string}
// Username for the user authenticated in this process. 
//
Object.defineProperty(config, 'username', {
  get: function () {
    return settings.auth ? settings.auth.split(':')[0] : null;
  }
});