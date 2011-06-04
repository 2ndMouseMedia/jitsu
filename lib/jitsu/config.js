/*
 * config.js: Configuration for the jitsu CLI.
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var nconf = require('nconf'),
    path = require('path'),
    winston = require('winston'),
    optimist = require('optimist'),
    argv = optimist.argv,
    fs = require('fs');

var config = module.exports = Object.create(nconf.Provider.prototype);

//
// Set up our default config
//
var dir = process.cwd(),
    configPath = argv.jitsuconf || argv.j,
    looking = true;

//
// Make sure the file exists if it was set explicitly
//
config.findJitsuconf = function () {
  if (configPath) {
    try {
      fs.statSync(configPath);
    }
    catch (ex) {
      return false;
    }
  }
  else {
    while (looking) {
      try {
        fs.statSync(configPath = path.join(dir, '.jitsuconf'));
        looking = false;
      }
      catch (e) {
        var olddir = dir;
        dir = path.dirname(dir);

        if (olddir === dir) {
          try {
            fs.statSync(configPath = path.join(process.env.HOME, '.jitsuconf'));
            looking = false;
          }
          catch (e) {
            //
            // Ignore errors
            //
          }
        }
      }
    }
  }

  if (!configPath) {
    return false;
  }

  winston.info('Using config file ' + configPath.magenta);
  config.use('file', { file: configPath });
  return true;
};

var _get = config.get,
    _load = config.load;

var defaults = {
  'root': process.env.HOME,
  'protocol': 'http',
  'remoteHost': 'api.nodejitsu.com',
  'userconfig': '.jitsuconf',
  'loglevel': 'info',
  'tmproot': '/tmp',
  'tar': 'tar',
  'gzipbin': 'gzip'
};

Object.defineProperty(defaults, 'remoteUri', {
  get: function () {
    var port = nconf.overrides.port || nconf.get('port') || this.port || '';
    if (port) {
      port = ':' + port;
    }
    
    return [this.protocol, '://', (nconf.overrides.remoteHost || nconf.get('remoteHost') || nconf.defaults.remoteHost), port].join('');
  }
});

config.load = function (callback) {
  //
  // Find the `.jitsuconf` file to be used for this
  // jitsu session.
  //
  if (!config.findJitsuconf()) {
    return callback(new Error(configPath.magenta + ' does not exist'), true);
  }
  
  _load.call(config, function (err, store) {
    if (err) {
      return callback(err);
    }
    
    if (store.auth) {
      var auth = store.auth.split(':');
      config.clear('auth');
      config.set('username', auth[0]);
      config.set('password', auth[1]);
      return config.save(callback);
    }
    
    callback();
  });
};

config.get = function (key) {
  if (optimist.argv.hasOwnProperty(key)) {
    return optimist.argv[key];
  }
  
  var value = _get.call(config, key);
  return typeof value !== 'undefined' ? value :  defaults[key];
};